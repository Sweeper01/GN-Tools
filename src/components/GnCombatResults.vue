<template>
    <div v-show="results.length > 0">
        <h1 class="mt-5">Übersicht</h1>
        <v-divider></v-divider>
        <gn-combat-result-overview :total="total"></gn-combat-result-overview>
        <div v-for="result in results" :key="result.tick">
            <h1 class="mt-5">Tick {{ result.tick }}</h1>
            <v-divider></v-divider>
            <!-- <gn-combat-result :result="result.data"></gn-combat-result> -->
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import GnCombatResultOverview from '@/components/GnCombatResultOverview'
import GnCombatResult from '@/components/GnCombatResult'
import config from '@/config.json'

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
            let _this = this

            let total = {
                target: {
                    name: 'Verteidiger',
                    extractors: {
                        before: {},
                        after: {},
                        stolen: {},
                    },
                    fleets: {
                        before: [
                            {
                                name: '0',
                                units: {},
                            },
                        ],
                        after: [
                            {
                                name: '0',
                                units: {},
                                losses: {},
                                destroyed: {},
                                resources: {
                                    cost: {},
                                },
                            },
                        ],
                    },
                    resources: {
                        salvaged: {},
                    },
                },
                attackers: [
                    {
                        name: 'Angreifer',
                        fleets: {
                            before: [
                                {
                                    name: '0',
                                    units: {},
                                },
                            ],
                            after: [
                                {
                                    name: '0',
                                    units: {},
                                    losses: {},
                                    destroyed: {},
                                    resources: {
                                        cost: {},
                                    },
                                    extractors: {
                                        stolen: {},
                                    },
                                },
                            ],
                        },
                    },
                ],
            }

            for (let i = 0; i < this.results.length; i++) {
                let result = this.results[i].data.data.attributes

                if (i == 0) {
                    Object.keys(config.EXEN).forEach((exe) => {
                        total.target.extractors.before[exe] = result.target.extractors.before[exe]
                    })
                }

                result.target.fleets.before.forEach((dfd) => {
                    Object.keys(dfd.units).forEach((u) => {
                        _this.add(total.target.fleets.before[0].units, u, dfd.units[u])
                    })
                })

                result.defenders.forEach((dfd) => {
                    dfd.fleets.before.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.target.fleets.before[0].units, u, fleet.units[u])
                        })
                    })
                })

                result.attackers.forEach((atk) => {
                    atk.fleets.before.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.attackers[0].fleets.before[0].units, u, fleet.units[u])
                        })
                    })
                })

                Object.keys(config.EXEN).forEach((exe) => {
                    total.target.extractors.after[exe] = result.target.extractors.after[exe]
                    total.target.extractors.stolen[exe] = result.target.extractors.stolen[exe]
                })

                Object.keys(config.RESOURCES).forEach((res) => {
                    total.target.resources.salvaged[res] = result.target.resources.salvaged[res]
                })

                result.target.fleets.after.forEach((dfd) => {
                    Object.keys(dfd.units).forEach((u) => {
                        _this.add(total.target.fleets.after[0].units, u, dfd.units[u])
                    })

                    Object.keys(dfd.losses).forEach((u) => {
                        _this.add(total.target.fleets.after[0].losses, u, dfd.losses[u])
                    })

                    Object.keys(dfd.destroyed).forEach((u) => {
                        _this.add(total.target.fleets.after[0].destroyed, u, dfd.destroyed[u])
                    })

                    Object.keys(config.RESOURCES).forEach((res) => {
                        // _this.add(total.target.fleets.after[0].resources.salvaged, res, dfd.resources.salvaged[res])
                        _this.add(total.target.fleets.after[0].resources.cost, res, dfd.resources.cost[res])
                    })
                })

                result.defenders.forEach((dfd) => {
                    dfd.fleets.after.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.target.fleets.after[0].units, u, fleet.units[u])
                        })

                        Object.keys(fleet.losses).forEach((u) => {
                            _this.add(total.target.fleets.after[0].losses, u, fleet.losses[u])
                        })

                        Object.keys(fleet.destroyed).forEach((u) => {
                            _this.add(total.target.fleets.after[0].destroyed, u, fleet.destroyed[u])
                        })

                        Object.keys(config.RESOURCES).forEach((res) => {
                            _this.add(total.target.resources.salvaged, res, fleet.resources.salvaged[res])
                            _this.add(total.target.fleets.after[0].resources.cost, res, fleet.resources.cost[res])
                        })
                    })
                })

                result.attackers.forEach((atk) => {
                    atk.fleets.after.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.attackers[0].fleets.after[0].units, u, fleet.units[u])
                        })

                        Object.keys(fleet.losses).forEach((u) => {
                            _this.add(total.attackers[0].fleets.after[0].losses, u, fleet.losses[u])
                        })

                        Object.keys(fleet.destroyed).forEach((u) => {
                            _this.add(total.attackers[0].fleets.after[0].destroyed, u, fleet.destroyed[u])
                        })

                        Object.keys(config.RESOURCES).forEach((res) => {
                            // _this.add(total.attackers[0].fleets.after[0].resources.salvaged, res, fleet.resources.salvaged[res])
                            _this.add(total.attackers[0].fleets.after[0].resources.cost, res, fleet.resources.cost[res])
                        })

                        Object.keys(config.EXEN).forEach((exe) => {
                            _this.add(total.attackers[0].fleets.after[0].extractors.stolen, exe, fleet.extractors.stolen[exe])
                        })
                    })
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
    methods: {
        add: function (obj, attr, number) {
            if (obj[attr] == undefined) {
                obj[attr] = 0
            }
            obj[attr] += number

            return obj
        },
    },
}
</script>