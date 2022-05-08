<template>
    <div v-show="results.length > 0">
        <h1 class="mt-5">Übersicht</h1>
        <v-divider></v-divider>
        <gn-combat-result-overview :total="total"></gn-combat-result-overview>
        <div v-for="result in results" :key="result.tick">
            <h1 class="mt-5">Tick {{ result.tick }}</h1>
            <v-divider></v-divider>
            <gn-combat-result :result="result.data"></gn-combat-result>
        </div>
    </div>
</template>
<script>
import GnCombatResultOverview from '@/components/GnCombatResultOverview'
import GnCombatResult from '@/components/GnCombatResult'

export default {
    name: 'GnCombatResults',
    components: {
        GnCombatResultOverview,
        GnCombatResult,
    },
    props: {
        results: function () {
            return {
                type: Array,
                default: [],
            }
        },
        extended: function () {
            return {
                type: Boolean,
                default: false,
            }
        },
    },
    computed: {
        total: function () {
            let total = {
                before: {
                    target: {
                        extractorsMetal: 0,
                        extractorsCrystal: 0,
                    },
                    attacker: [
                        {
                            name: 'Angreifer',
                            units: {},
                        },
                    ],
                    defender: [
                        {
                            name: 'Verteidiger',
                            units: {},
                        },
                    ],
                },
                after: {
                    target: {
                        extractorsMetal: 0,
                        extractorsCrystal: 0,
                        stolenExtractorsMetal: 0,
                        stolenExtractorsCrystal: 0,
                    },
                    attacker: [
                        {
                            name: 'Angreifer',
                            lostUnits: {},
                            costForNewConstructionMetal: 0,
                            costForNewConstructionCrystal: 0,
                            stolenMetalExtractors: 0,
                            stolenCrystalExtractors: 0,
                        },
                    ],
                    defender: [
                        {
                            name: 'Verteidiger',
                            lostUnits: {},
                            costForNewConstructionMetal: 0,
                            costForNewConstructionCrystal: 0,
                            salvagedMetal: 0,
                            salvagedCrystal: 0,
                        },
                    ],
                },
            }

            let attackers = {}
            let defenders = {}

            for (let i = 0; i < this.results.length; i++) {
                let result = this.results[i].data.data.attributes

                if (i == 0) {
                    total.before.target.extractorsMetal = result.before.target.extractorsMetal
                    total.before.target.extractorsCrystal = result.before.target.extractorsCrystal
                }

                result.before.attacker.forEach((atk) => {
                    if (!attackers[atk.name]) {
                        attackers[atk.name] = true
                        for (let unitId in atk.units) {
                            let unit = atk.units[unitId]
                            if (total.before.attacker[0].units[unitId]) {
                                total.before.attacker[0].units[unitId] += unit
                            } else {
                                total.before.attacker[0].units[unitId] = unit
                            }
                        }
                    }
                })
                result.before.defender.forEach((dfd) => {
                    if (!defenders[dfd.name]) {
                        defenders[dfd.name] = true
                        for (let unitId in dfd.units) {
                            let unit = dfd.units[unitId]
                            if (total.before.defender[0].units[unitId]) {
                                total.before.defender[0].units[unitId] += unit
                            } else {
                                total.before.defender[0].units[unitId] = unit
                            }
                        }
                    }
                })

                total.after.target.extractorsMetal = result.after.target.extractorsMetal
                total.after.target.extractorsCrystal = result.after.target.extractorsCrystal
                total.after.target.stolenExtractorsMetal += result.after.target.stolenExtractorsMetal
                total.after.target.stolenExtractorsCrystal += result.after.target.stolenExtractorsCrystal

                result.after.attacker.forEach((atk) => {
                    total.after.attacker[0].costForNewConstructionMetal += atk.costForNewConstructionMetal
                    total.after.attacker[0].costForNewConstructionCrystal += atk.costForNewConstructionCrystal
                    total.after.attacker[0].stolenMetalExtractors += atk.stolenMetalExtractors
                    total.after.attacker[0].stolenCrystalExtractors += atk.stolenCrystalExtractors

                    for (let unitId in atk.lostUnits) {
                        let unit = atk.lostUnits[unitId]
                        if (total.after.attacker[0].lostUnits[unitId]) {
                            total.after.attacker[0].lostUnits[unitId] += unit
                        } else {
                            total.after.attacker[0].lostUnits[unitId] = unit
                        }
                    }
                })

                result.after.defender.forEach((dfd) => {
                    total.after.defender[0].costForNewConstructionMetal += dfd.costForNewConstructionMetal
                    total.after.defender[0].costForNewConstructionCrystal += dfd.costForNewConstructionCrystal
                    total.after.defender[0].salvagedMetal += dfd.salvagedMetal
                    total.after.defender[0].salvagedCrystal += dfd.salvagedCrystal

                    for (let unitId in dfd.lostUnits) {
                        let unit = dfd.lostUnits[unitId]
                        if (total.after.defender[0].lostUnits[unitId]) {
                            total.after.defender[0].lostUnits[unitId] += unit
                        } else {
                            total.after.defender[0].lostUnits[unitId] = unit
                        }
                    }
                })
            }

            let out = {
                data: {
                    type: 'combat-results',
                    attributes: total,
                },
            }
            return out
        },
    },
    methods: {},
}
</script>