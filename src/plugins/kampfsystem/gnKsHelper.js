/* eslint-disable */
import gnConfig from "./gnConfig.json";

export default {

    createResponseFromRequest: function (request) {
        let response = JSON.parse(JSON.stringify(request))

        delete response.attributes.config

        //target fleets
        let fleets = JSON.parse(JSON.stringify(request.attributes.target.fleets))
        fleets.forEach((fleet) => {
            delete fleet.calculateCarrierCapacityLosses
        })
        response.attributes.target.fleets = {}
        response.attributes.target.fleets.before = fleets

        fleets = JSON.parse(JSON.stringify(fleets))
        fleets.forEach((fleet) => {
            fleet.losses = {}
            fleet.destroyed = {}
            fleet.losses = {}
            fleet.resources = { "cost": { "metal": 0, "crystal": 0 } }
        })
        response.attributes.target.fleets.after = fleets

        //target extractors
        let extractors = request.attributes.target.extractors
        response.attributes.target.extractors = {}
        response.attributes.target.extractors.before = JSON.parse(JSON.stringify(extractors))
        response.attributes.target.extractors.after = JSON.parse(JSON.stringify(extractors))
        response.attributes.target.extractors.stolen = { "metal": 0, "crystal": 0 }

        response.attributes.target.resources = { "salvaged": { "metal": 0, "crystal": 0 } }

        //attackers
        response.attributes.attackers.forEach((attacker) => {
            fleets = JSON.parse(JSON.stringify(attacker.fleets))
            // fleets.forEach((fleet) => {
            //     delete fleet.calculateCarrierCapacityLosses
            // })
            attacker.fleets = {}
            attacker.fleets.before = fleets

            fleets = JSON.parse(JSON.stringify(fleets))
            fleets.forEach((fleet) => {
                fleet.losses = {}
                fleet.destroyed = {}
                fleet.losses = {}
                fleet.carrierCapacityLosses = {}
                fleet.extractorLosses = {}
                fleet.resources = { "cost": { "metal": 0, "crystal": 0 } }
                fleet.extractors = { "stolen": { "metal": 0, "crystal": 0 } }
            })
            attacker.fleets.after = fleets
        })

        //defenders
        response.attributes.defenders.forEach((defender) => {
            fleets = JSON.parse(JSON.stringify(defender.fleets))
            // fleets.forEach((fleet) => {
            //     delete fleet.calculateCarrierCapacityLosses
            // })
            defender.fleets = {}
            defender.fleets.before = fleets

            fleets = JSON.parse(JSON.stringify(fleets))
            fleets.forEach((fleet) => {
                fleet.losses = {}
                fleet.destroyed = {}
                fleet.losses = {}
                fleet.carrierCapacityLosses = {}
                fleet.resources = { "cost": { "metal": 0, "crystal": 0 }, "salvaged": { "metal": 0, "crystal": 0 } }
            })
            defender.fleets.after = fleets
        })

        return response
    },

    // BattleMode values
    // 0 => regular battle
    // 1 => pre strike, 1 tick before regular battle
    // 2 => pre strike, 2 tick before regular battle
    isPreStrikeMode: function (mode) {
        return mode !== gnConfig.MODE_BATTLE;
    },

    isBattleMode: function (mode) {
        return mode === gnConfig.MODE_BATTLE;
    },

    getUnitById: function (UnitId) {
        let result;
        gnConfig.units.forEach((unit) => {
            if (unit.unitId == UnitId) {
                result = unit
                return
            }
        })
        return result
    },

    calculateStrikes: function (unit, stateAttacker, stateDefender) {
        var minRatio = this.getCombatSettingMinRatio(unit);
        if (minRatio === 0) {
            return minRatio;
        }
        return Math.ceil(1 / minRatio) + 3;
    },

    getCombatSettingMinRatio: function (unit) {
        let ratio = 0;
        unit.combatSettings.forEach((setting) => {
            if (ratio == 0 || ratio > setting.ratio) {
                ratio = setting.ratio
            }
        })
        return ratio
    },

    getCombatSettingByMode: function (unit, mode) {
        let settings = [];
        unit.combatSettings.forEach((setting) => {
            if (setting.mode == mode) {
                settings.push(setting)
            }
        })
        return JSON.parse(JSON.stringify(settings));
    },

    sumDefenderAndTarget: function (target, defenders) {
        let sumDefender = {
            fleets: {
                before: {
                    units: {}
                },
                after: {
                    units: {},
                }
            }
        }

        target.fleets.before.forEach((fleet) => {
            for (const [key, value] of Object.entries(fleet.units)) {
                sumDefender.fleets.before.units[key] = sumDefender.fleets.before.units[key] ? sumDefender.fleets.before.units[key] + value : value
            }
        })
        target.fleets.after.forEach((fleet) => {
            for (const [key, value] of Object.entries(fleet.units)) {
                sumDefender.fleets.after.units[key] = sumDefender.fleets.after.units[key] ? sumDefender.fleets.after.units[key] + value : value
            }
        })


        defenders.forEach((defender) => {
            defender.fleets.before.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.units)) {
                    sumDefender.fleets.before.units[key] = sumDefender.fleets.before.units[key] ? sumDefender.fleets.before.units[key] + value : value
                }
            })
            defender.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.units)) {
                    sumDefender.fleets.after.units[key] = sumDefender.fleets.after.units[key] ? sumDefender.fleets.after.units[key] + value : value
                }
            })
        })

        return sumDefender
    },

    sumAttacker: function (attackers) {
        let sumAttacker = {
            fleets: {
                before: {
                    units: {}
                },
                after: {
                    units: {},
                }
            }
        }

        attackers.forEach((attacker) => {
            attacker.fleets.before.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.units)) {
                    sumAttacker.fleets.before.units[key] = sumAttacker.fleets.before.units[key] ? sumAttacker.fleets.before.units[key] + value : value
                }
            })
            attacker.fleets.after.forEach((fleet) => {
                for (const [key, value] of Object.entries(fleet.units)) {
                    sumAttacker.fleets.after.units[key] = sumAttacker.fleets.after.units[key] ? sumAttacker.fleets.after.units[key] + value : value
                }
            })
        })

        return sumAttacker
    },

    getTotalUnitsForFleet: function (fleet, unitId) {
        let units = 0
        if (fleet.units[unitId]) {
            units = fleet.units[unitId]
        }
        // fleets.forEach((fleet) => {
        // units += fleet.units[unitId] = fleet.units[unitId] || 0
        // })
        return units
    },

    getTotalUnitsForDefenders: function (target, defenders, unitId, state) {
        let units = 0;

        units += getTotalUnitsForFleet(target.fleets[state], unitId)

        defenders.forEach((defender) => {
            units += getTotalUnitsForFleet(defender.fleets[state], unitId)
        })

        return units
    },

    sumExtractorStealPotential: function (fleets) {
        let _this = this
        let total = 0;
        fleets.forEach((fleet) => {
            total += _this.sumExtractorStealPotentialPerFleet(fleet)
        })

        return total
    },

    sumExtractorStealPotentialPerFleet: function (fleet) {
        let _this = this
        let total = 0;
        gnConfig.units.forEach((unit) => {
            if (unit.extractorStealAmount > 0) {
                let amount = _this.getTotalUnitsForFleet(fleet, unit.unitId) * unit.extractorStealAmount
                if (amount > 0) {
                    total += amount
                }
            }
        })

        return total
    },

    sumExtractorGuardPotential: function (fleets) {
        let _this = this
        let total = 0;
        fleets.forEach((fleet) => {
            total += _this.sumExtractorGuardPotentialPerFleet(fleet)
        })

        return total
    },

    sumExtractorGuardPotentialPerFleet: function (fleet) {
        let _this = this
        let total = 0;
        gnConfig.units.forEach((unit) => {
            if (unit.extractorGuardAmount > 0) {
                let amount = _this.getTotalUnitsForFleet(fleet, unit.unitId) * unit.extractorGuardAmount
                if (amount > 0) {
                    total += amount
                }
            }
        })

        return total
    },

    countCarrierConsumption: function (fleet) {
        let _this = this
        let total = 0;
        gnConfig.units.forEach((unit) => {
            if (unit.carrierSpaceConsumption > 0) {
                let amount = _this.getTotalUnitsForFleet(fleet, unit.unitId) * unit.carrierSpaceConsumption
                if (amount > 0) {
                    total += amount
                }
            }
        })

        return total
    },

    countCarrierCapacity: function (fleet) {
        let _this = this
        let total = 0;
        gnConfig.units.forEach((unit) => {
            if (unit.carrierSpace > 0) {
                let amount = _this.getTotalUnitsForFleet(fleet, unit.unitId) * unit.carrierSpace
                if (amount > 0) {
                    total += amount
                }
            }
        })

        return total
    },

    calculateTotalStolen: function (target, maxPotential) {
        let maxPotentialMetal = Math.ceil(maxPotential / 2)
        let maxPotentialCrystal = Math.floor(maxPotential / 2)

        let stolenMetal = Math.min(maxPotentialMetal, Math.floor(target.extractors.before.metal * gnConfig.DEFAULT_EXTRACTOR_STEAL_RATIO))

        if (stolenMetal != maxPotentialMetal) {
            maxPotentialCrystal += maxPotentialMetal - stolenMetal
        }

        let stolenCrystal = Math.min(maxPotentialCrystal, Math.floor(target.extractors.before.crystal * gnConfig.DEFAULT_EXTRACTOR_STEAL_RATIO))

        if (stolenCrystal != maxPotentialCrystal) {
            maxPotentialMetal += maxPotentialMetal - stolenCrystal
            stolenMetal = Math.min(maxPotentialMetal, Math.floor(target.extractors.before.metal * gnConfig.DEFAULT_EXTRACTOR_STEAL_RATIO))
        }

        return { metal: stolenMetal, crystal: stolenCrystal }
    }
}