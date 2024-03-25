/* eslint-disable */
import gnKsHelper from "./gnKsHelper";
import gnConfig from "./gnConfig.json";

export default {

    execute: function (request) {
        console.warn("request", JSON.parse(JSON.stringify(request)))

        let data = request.data
        let mode = data.attributes.config.mode

        data = this.strikeCombat(data)

        if (gnKsHelper.isBattleMode(mode)) {
            data = this.extractorCombat(data)
            data = this.carrierCombat(data)
        }

        data = this.costCombat(data)

        if (gnKsHelper.isBattleMode(mode)) {
            data = this.salvageCombat(data)
        }

        let response = { data: data }

        console.warn("response", response)

        return response
    },

    strikeCombat: function (request) {

        let response = gnKsHelper.createResponseFromRequest(request)
        let mode = request.attributes.config.mode
        let isPreStrikeMode = gnKsHelper.isPreStrikeMode(mode);

        let sumAttacker = gnKsHelper.sumAttacker(response.attributes.attackers)
        let sumDefender = gnKsHelper.sumDefenderAndTarget(response.attributes.target, response.attributes.defenders)

        gnConfig.units.forEach((attackingUnit) => {
            let combatSettings = gnKsHelper.getCombatSettingByMode(attackingUnit, mode)
            let attackerUnits = gnKsHelper.getTotalUnitsForFleet(sumAttacker.fleets.before, attackingUnit.unitId)
            let defenderUnits = gnKsHelper.getTotalUnitsForFleet(sumDefender.fleets.before, attackingUnit.unitId)

            let unusedRatioAttacker = 0
            let ratioAttacker = 0
            let unusedRatioDefender = 0
            let ratioDefender = 0
            let unusedRatioCalculatedAttacker = []
            let unusedRatioCalculatedDefender = []

            let targetUnitsDefender = {}
            let targetUnitsAttacker = {}
            combatSettings.forEach((combatSetting) => {
                targetUnitsDefender[combatSetting.targetUnitId] = gnKsHelper.getTotalUnitsForFleet(sumDefender.fleets.after, combatSetting.targetUnitId)
                targetUnitsAttacker[combatSetting.targetUnitId] = gnKsHelper.getTotalUnitsForFleet(sumAttacker.fleets.after, combatSetting.targetUnitId)
            })

            let strikes = gnKsHelper.calculateStrikes(attackingUnit)
            for (let currentStrike = 1; currentStrike <= strikes; currentStrike++) {

                let remainingUnitsAttacker = attackerUnits;
                let remainingUnitsDefender = defenderUnits;
                combatSettings.forEach((combatSetting) => {

                    //attacker
                    if (!isPreStrikeMode) {
                        ratioAttacker = combatSetting.ratio
                        unusedRatioAttacker = Math.min(1 - ratioAttacker, unusedRatioAttacker)
                        if (currentStrike > 3) {
                            ratioAttacker += unusedRatioAttacker
                        }

                        let destroyedAttacker = this.calculateDestroyed(combatSetting, attackerUnits, remainingUnitsAttacker, targetUnitsDefender[combatSetting.targetUnitId], ratioAttacker)

                        if (destroyedAttacker > 0) {
                            sumDefender.fleets.after.units[combatSetting.targetUnitId] -= destroyedAttacker

                            targetUnitsDefender[combatSetting.targetUnitId] -= destroyedAttacker

                            this.splitDestroyedAttacker(combatSetting, sumAttacker, attackingUnit, destroyedAttacker, response)
                        }

                        let usedUnits = destroyedAttacker / combatSetting.attackPower
                        remainingUnitsAttacker = Math.max(remainingUnitsAttacker - usedUnits, 0)
                        if (currentStrike > 3 && !unusedRatioCalculatedAttacker.includes(combatSetting.targetUnitId)) {
                            if (remainingUnitsAttacker > 0) {
                                unusedRatioAttacker += Math.max(combatSetting.ratio - usedUnits / attackerUnits, 0.0);
                            }
                            unusedRatioCalculatedAttacker.push(combatSetting.targetUnitId)
                        }
                    }

                    //defender
                    ratioDefender = combatSetting.ratio
                    unusedRatioDefender = Math.min(1 - ratioDefender, unusedRatioDefender)
                    if (currentStrike > 3 && !isPreStrikeMode) {
                        ratioDefender += unusedRatioDefender
                    }

                    let destroyedDefender = this.calculateDestroyed(combatSetting, defenderUnits, remainingUnitsDefender, targetUnitsAttacker[combatSetting.targetUnitId], ratioDefender)

                    if (destroyedDefender > 0) {
                        sumAttacker.fleets.after.units[combatSetting.targetUnitId] -= destroyedDefender

                        targetUnitsAttacker[combatSetting.targetUnitId] -= destroyedDefender

                        this.splitDestroyedDefender(combatSetting, sumDefender, attackingUnit, destroyedDefender, response)
                    }

                    let usedUnits = destroyedDefender / combatSetting.attackPower
                    remainingUnitsDefender = Math.max(remainingUnitsDefender - usedUnits, 0)
                    if (currentStrike > 3 && !unusedRatioCalculatedDefender.includes(combatSetting.targetUnitId)) {
                        if (remainingUnitsDefender > 0) {
                            unusedRatioDefender += Math.max(combatSetting.ratio - usedUnits / defenderUnits, 0.0);
                        }
                        unusedRatioCalculatedDefender.push(combatSetting.targetUnitId)
                    }
                })

                attackerUnits = remainingUnitsAttacker
                defenderUnits = remainingUnitsDefender
            }
        })

        // TODO: Verluste von Trägern im Vortick: Jäger/Bomber werden anteilig verloren 
        // if ($isPreStrikeMode) {
        //     $this->calculateCarrierCapacityLosses($unitCollection, $fleetStateAttacker->after);
        //     $this->calculateCarrierCapacityLosses($unitCollection, $fleetStateDefender->after);
        // }

        gnConfig.units.forEach((unit) => {
            response = this.splitLosses(unit, sumAttacker, sumDefender, response)
        })

        return response
    },

    calculateDestroyed: function (combatSetting, units, remainingUnits, targetUnits, ratio) {

        let maxKillabe = Math.floor(Math.round(ratio * units * combatSetting.attackPower * 100) / 100)

        let destroyed = Math.floor(Math.min(maxKillabe, targetUnits, Math.round(remainingUnits * combatSetting.attackPower * 10000) / 10000))

        return Math.max(destroyed, 0);
    },

    splitDestroyedAttacker: function (combatSetting, sumAttacker, attackingUnit, destroyed, response) {
        let attackingUnitsNumberTotal = gnKsHelper.getTotalUnitsForFleet(sumAttacker.fleets.before, attackingUnit.unitId)

        response.attributes.attackers.forEach((attacker) => {
            attacker.fleets.before.forEach((fleetBefore) => {

                let responsibleDestruction = destroyed * fleetBefore.units[attackingUnit.unitId] / attackingUnitsNumberTotal;
                if (responsibleDestruction > 0.0) {
                    responsibleDestruction = Math.round(responsibleDestruction)
                    attacker.fleets.after.forEach((fleetAfter) => {
                        if (fleetAfter.name == fleetBefore.name) {
                            fleetAfter.destroyed[combatSetting.targetUnitId] = fleetAfter.destroyed[combatSetting.targetUnitId] ? fleetAfter.destroyed[combatSetting.targetUnitId] + responsibleDestruction : responsibleDestruction
                        }
                    })
                }
            })
        })
    },

    splitDestroyedDefender: function (combatSetting, sumDefender, attackingUnit, destroyed, response) {
        let attackingUnitsNumberTotal = gnKsHelper.getTotalUnitsForFleet(sumDefender.fleets.before, attackingUnit.unitId)

        response.attributes.defenders.forEach((defender) => {
            defender.fleets.before.forEach((fleetBefore) => {

                let responsibleDestruction = destroyed * fleetBefore.units[attackingUnit.unitId] / attackingUnitsNumberTotal;
                if (responsibleDestruction > 0.0) {
                    responsibleDestruction = Math.round(responsibleDestruction)
                    defender.fleets.after.forEach((fleetAfter) => {
                        if (fleetAfter.name == fleetBefore.name) {
                            fleetAfter.destroyed[combatSetting.targetUnitId] = fleetAfter.destroyed[combatSetting.targetUnitId] ? fleetAfter.destroyed[combatSetting.targetUnitId] + responsibleDestruction : responsibleDestruction
                        }
                    })
                }
            })
        })

        response.attributes.target.fleets.before.forEach((fleetBefore) => {
            let responsibleDestruction = destroyed * fleetBefore.units[attackingUnit.unitId] / attackingUnitsNumberTotal;
            if (responsibleDestruction > 0.0) {
                responsibleDestruction = Math.round(responsibleDestruction)
                response.attributes.target.fleets.after.forEach((fleetAfter) => {
                    if (fleetAfter.name == fleetBefore.name) {
                        fleetAfter.destroyed[combatSetting.targetUnitId] = fleetAfter.destroyed[combatSetting.targetUnitId] ? fleetAfter.destroyed[combatSetting.targetUnitId] + responsibleDestruction : responsibleDestruction
                    }
                })
            }
        })
    },

    splitLosses: function (unit, sumAttacker, sumDefender, response) {
        //attacker
        let unitsBeforeTotal = gnKsHelper.getTotalUnitsForFleet(sumAttacker.fleets.before, unit.unitId)
        let unitsAfterTotal = gnKsHelper.getTotalUnitsForFleet(sumAttacker.fleets.after, unit.unitId)

        response.attributes.attackers.forEach((attacker) => {
            attacker.fleets.before.forEach((fleetBefore) => {
                if (fleetBefore.units[unit.unitId]) {
                    let unitsBefore = fleetBefore.units[unit.unitId]
                    let unitsLeft = Math.max(Math.round(unitsAfterTotal * unitsBefore / unitsBeforeTotal), 0);
                    let numberOfLostUnits = unitsBefore - unitsLeft;
                    if (numberOfLostUnits > 0) {
                        // var fleetAfter = strikeState.fleetsAfter.getFleetById(fleet.fleetId);
                        // fleetAfter.losses.add(unit.unitId, numberOfLostUnits);
                        // fleetAfter.units.sub(unit.unitId, numberOfLostUnits);
                        attacker.fleets.after.forEach((fleetAfter) => {
                            if (fleetAfter.name == fleetBefore.name) {
                                fleetAfter.losses[unit.unitId] = fleetAfter.losses[unit.unitId] ? fleetAfter.losses[unit.unitId] + numberOfLostUnits : numberOfLostUnits
                                fleetAfter.units[unit.unitId] -= numberOfLostUnits
                            }
                        })
                    }
                }
            })
        })

        //defender
        unitsBeforeTotal = gnKsHelper.getTotalUnitsForFleet(sumDefender.fleets.before, unit.unitId)
        unitsAfterTotal = gnKsHelper.getTotalUnitsForFleet(sumDefender.fleets.after, unit.unitId)

        response.attributes.defenders.forEach((defender) => {
            defender.fleets.before.forEach((fleetBefore) => {
                if (fleetBefore.units[unit.unitId]) {
                    let unitsBefore = fleetBefore.units[unit.unitId]
                    let unitsLeft = Math.max(Math.round(unitsAfterTotal * unitsBefore / unitsBeforeTotal), 0);
                    let numberOfLostUnits = unitsBefore - unitsLeft;
                    if (numberOfLostUnits > 0) {
                        // var fleetAfter = strikeState.fleetsAfter.getFleetById(fleet.fleetId);
                        // fleetAfter.losses.add(unit.unitId, numberOfLostUnits);
                        // fleetAfter.units.sub(unit.unitId, numberOfLostUnits);
                        defender.fleets.after.forEach((fleetAfter) => {
                            if (fleetAfter.name == fleetBefore.name) {
                                fleetAfter.losses[unit.unitId] = fleetAfter.losses[unit.unitId] ? fleetAfter.losses[unit.unitId] + numberOfLostUnits : numberOfLostUnits
                                fleetAfter.units[unit.unitId] -= numberOfLostUnits
                            }
                        })
                    }
                }
            })
        })

        //target
        response.attributes.target.fleets.before.forEach((fleetBefore) => {
            if (fleetBefore.units[unit.unitId]) {
                let unitsBefore = fleetBefore.units[unit.unitId]
                let unitsLeft = Math.max(Math.round(unitsAfterTotal * unitsBefore / unitsBeforeTotal), 0);
                let numberOfLostUnits = unitsBefore - unitsLeft;
                if (numberOfLostUnits > 0) {
                    // var fleetAfter = strikeState.fleetsAfter.getFleetById(fleet.fleetId);
                    // fleetAfter.losses.add(unit.unitId, numberOfLostUnits);
                    // fleetAfter.units.sub(unit.unitId, numberOfLostUnits);
                    response.attributes.target.fleets.after.forEach((fleetAfter) => {
                        if (fleetAfter.name == fleetBefore.name) {
                            fleetAfter.losses[unit.unitId] = fleetAfter.losses[unit.unitId] ? fleetAfter.losses[unit.unitId] + numberOfLostUnits : numberOfLostUnits
                            fleetAfter.units[unit.unitId] -= numberOfLostUnits
                        }
                    })
                }
            }
        })

        return response
    },

    // calculateCarrierCapacityLosses: function (unitCollection, units) {
    //    TODO calculate carrier space losses due to pre strike
    // }

    extractorCombat: function (response) {
        let sumAttacker = gnKsHelper.sumAttacker(response.attributes.attackers)
        let sumDefender = gnKsHelper.sumDefenderAndTarget(response.attributes.target, response.attributes.defenders)

        let stealPotential = gnKsHelper.sumExtractorStealPotentialPerFleet(sumAttacker.fleets.after)
        let guardPotential = gnKsHelper.sumExtractorGuardPotentialPerFleet(sumDefender.fleets.after)

        console.warn("steal", stealPotential, "guard", guardPotential)

        let maxPotential = stealPotential - guardPotential

        if (maxPotential <= 0) {
            return response
        }

        let stolen = gnKsHelper.calculateTotalStolen(response.attributes.target, maxPotential)

        if ((stolen.metal + stolen.crystal) <= 0) {
            return response
        }

        response.attributes.target.extractors.after.metal -= stolen.metal
        response.attributes.target.extractors.after.crystal -= stolen.crystal
        response.attributes.target.extractors.stolen.metal += stolen.metal
        response.attributes.target.extractors.stolen.crystal += stolen.crystal

        this.splitStolenExtractors(response, stolen, stealPotential)

        return response
    },

    splitStolenExtractors: function (response, stolen, stealPotential) {
        response.attributes.attackers.forEach((attacker) => {
            attacker.fleets.after.forEach((fleet) => {
                let fleetPotential = gnKsHelper.sumExtractorStealPotentialPerFleet(fleet)

                if (fleetPotential <= 0) {
                    return;
                }

                let sharePercent = fleetPotential / stealPotential * 100

                fleet.extractors.stolen.metal = Math.round(sharePercent / 100 * stolen.metal)
                fleet.extractors.stolen.crystal = Math.round(sharePercent / 100 * stolen.crystal)

                let totalStolen = fleet.extractors.stolen.metal + fleet.extractors.stolen.crystal

                gnConfig.units.forEach((unit) => {
                    if (unit.extractorStealAmount == 0 || totalStolen <= 0) {
                        return
                    }

                    let neededUnitsForLeftExtractors = Math.ceil(totalStolen / unit.extractorStealAmount)
                    let numberOfUnitsInFleet = gnKsHelper.getTotalUnitsForFleet(fleet, unit.unitId)
                    let reduceUnitNumberBy = neededUnitsForLeftExtractors

                    if (numberOfUnitsInFleet <= neededUnitsForLeftExtractors) {
                        reduceUnitNumberBy = numberOfUnitsInFleet
                    }

                    totalStolen = reduceUnitNumberBy * unit.extractorStealAmount

                    fleet.units[unit.unitId] -= reduceUnitNumberBy
                    fleet.losses[unit.unitId] ? fleet.losses[unit.unitId] += reduceUnitNumberBy : fleet.losses[unit.unitId] = reduceUnitNumberBy
                    fleet.extractorLosses[unit.unitId] ? fleet.extractorLosses[unit.unitId] += reduceUnitNumberBy : fleet.extractorLosses[unit.unitId] = reduceUnitNumberBy
                })
            })
        })
    },

    carrierCombat: function (response) {
        console.warn("carrierCombat", response)

        response.attributes.defenders.forEach((defender) => {

            defender.fleets.after.forEach((fleet) => {

                if (fleet.calculateCarrierCapacityLosses) {
                    let carrierConsumption = gnKsHelper.countCarrierConsumption(fleet)
                    let carrierCapacity = gnKsHelper.countCarrierCapacity(fleet)

                    if (carrierConsumption > 0 && carrierConsumption > carrierCapacity) {

                        let insufficientCapacity = carrierConsumption - carrierCapacity

                        for (const [key, value] of Object.entries(fleet.units)) {

                            let unit = gnKsHelper.getUnitById(key)

                            if (unit.carrierSpaceConsumption > 0) {

                                let lostUnits = Math.round(insufficientCapacity * (value / carrierConsumption))

                                fleet.losses[key] = fleet.losses[key] ? fleet.losses[key] + lostUnits : lostUnits
                                fleet.units[key] -= lostUnits
                                fleet.carrierCapacityLosses[key] = fleet.carrierCapacityLosses[key] ? fleet.carrierCapacityLosses[key] + lostUnits : lostUnits
                            }
                        }
                    }
                }
            })
        })

        response.attributes.attackers.forEach((attacker) => {

            attacker.fleets.after.forEach((fleet) => {
                if (fleet.calculateCarrierCapacityLosses) {
                    let carrierConsumption = gnKsHelper.countCarrierConsumption(fleet)
                    let carrierCapacity = gnKsHelper.countCarrierCapacity(fleet)

                    if (carrierConsumption > 0 && carrierConsumption > carrierCapacity) {

                        let insufficientCapacity = carrierConsumption - carrierCapacity

                        for (const [key, value] of Object.entries(fleet.units)) {

                            let unit = gnKsHelper.getUnitById(key)

                            if (unit.carrierSpaceConsumption > 0) {

                                let lostUnits = Math.round(insufficientCapacity * (value / carrierConsumption))

                                fleet.losses[key] = fleet.losses[key] ? fleet.losses[key] + lostUnits : lostUnits
                                fleet.units[key] -= lostUnits
                                fleet.carrierCapacityLosses[key] = fleet.carrierCapacityLosses[key] ? fleet.carrierCapacityLosses[key] + lostUnits : lostUnits
                            }
                        }
                    }
                }
            })
        })

        return response
    },

    costCombat: function (response) {

        response.attributes.attackers.forEach((attacker) => {
            attacker.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.losses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        fleet.resources.cost.metal = fleet.resources.cost.metal ? fleet.resources.cost.metal + unit.costMetal * value : unit.costMetal * value
                        fleet.resources.cost.crystal = fleet.resources.cost.crystal ? fleet.resources.cost.crystal + unit.costCrystal * value : unit.costCrystal * value
                    }
                }
            })
        })

        response.attributes.defenders.forEach((defender) => {
            defender.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.losses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        fleet.resources.cost.metal = fleet.resources.cost.metal ? fleet.resources.cost.metal + unit.costMetal * value : unit.costMetal * value
                        fleet.resources.cost.crystal = fleet.resources.cost.crystal ? fleet.resources.cost.crystal + unit.costCrystal * value : unit.costCrystal * value
                    }
                }
            })
        })

        response.attributes.target.fleets.after.forEach((fleet) => {
            for (const [key, value] of Object.entries(fleet.losses)) {
                if (value > 0) {
                    let unit = gnKsHelper.getUnitById(key)
                    fleet.resources.cost.metal = fleet.resources.cost.metal ? fleet.resources.cost.metal + unit.costMetal * value : unit.costMetal * value
                    fleet.resources.cost.crystal = fleet.resources.cost.crystal ? fleet.resources.cost.crystal + unit.costCrystal * value : unit.costCrystal * value
                }
            }
        })

        return response
    },

    salvageCombat: function (response) {
        let totalSalvageable = { metal: 0, crystal: 0 }
        let totalCostExtractorLosses = 0
        let totalCostDestroyed = 0

        response.attributes.defenders.forEach((defender) => {
            defender.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.losses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalSalvageable.metal += unit.costMetal * value
                        totalSalvageable.crystal += unit.costCrystal * value
                    }
                }
                for (const [key, value] of Object.entries(fleet.destroyed)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalCostDestroyed += unit.costMetal * value
                        totalCostDestroyed += unit.costCrystal * value
                    }
                }
                for (const [key, value] of Object.entries(fleet.carrierCapacityLosses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalSalvageable.metal -= unit.costMetal * value
                        totalSalvageable.crystal -= unit.costCrystal * value
                    }
                }
            })
        })

        response.attributes.target.fleets.after.forEach((fleet) => {
            for (const [key, value] of Object.entries(fleet.losses)) {
                if (value > 0) {
                    let unit = gnKsHelper.getUnitById(key)
                    totalSalvageable.metal += unit.costMetal * value
                    totalSalvageable.crystal += unit.costCrystal * value
                }
            }
        })

        response.attributes.attackers.forEach((attacker) => {
            attacker.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.losses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalSalvageable.metal += unit.costMetal * value
                        totalSalvageable.crystal += unit.costCrystal * value
                    }
                }
                for (const [key, value] of Object.entries(fleet.extractorLosses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalSalvageable.metal -= unit.costMetal * value
                        totalSalvageable.crystal -= unit.costCrystal * value
                        totalCostExtractorLosses += unit.costMetal * value
                        totalCostExtractorLosses += unit.costCrystal * value
                    }
                }
                for (const [key, value] of Object.entries(fleet.carrierCapacityLosses)) {
                    if (value > 0) {
                        let unit = gnKsHelper.getUnitById(key)
                        totalSalvageable.metal -= unit.costMetal * value
                        totalSalvageable.crystal -= unit.costCrystal * value
                    }
                }
            })
        })


        if (totalSalvageable.metal > 0 || totalSalvageable.crystal > 0) {
            //Target
            response.attributes.target.resources.salvaged.metal = Math.floor(Math.round(totalSalvageable.metal * gnConfig.DEFAULT_SALVAGE_TARGET_RATIO * 10000) / 10000)
            response.attributes.target.resources.salvaged.crystal = Math.floor(Math.round(totalSalvageable.crystal * gnConfig.DEFAULT_SALVAGE_TARGET_RATIO * 10000) / 10000)

            //Defender
            response.attributes.defenders.forEach((defender) => {
                defender.fleets.after.forEach((fleet) => {
                    let destroyedByFleet = 0
                    for (const [key, value] of Object.entries(fleet.destroyed)) {
                        if (value > 0) {
                            let unit = gnKsHelper.getUnitById(key)
                            destroyedByFleet += unit.costMetal * value
                            destroyedByFleet += unit.costCrystal * value
                        }
                    }

                    let totalDestroyed = totalCostDestroyed + totalCostExtractorLosses

                    if (totalDestroyed > 0) {

                        let share = destroyedByFleet / totalDestroyed

                        fleet.resources.salvaged.metal = Math.floor(Math.round(share * gnConfig.DEFAULT_SALVAGE_DEFENDER_RATIO * totalSalvageable.metal * 10000) / 10000)
                        fleet.resources.salvaged.crystal = Math.floor(Math.round(share * gnConfig.DEFAULT_SALVAGE_DEFENDER_RATIO * totalSalvageable.crystal * 10000) / 10000)
                    }
                })
            })
        }

        return response
    }
}