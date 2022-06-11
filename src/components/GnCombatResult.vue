<template>
    <div v-show="result.data">
        <v-card class="gn-combat-result">
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-row>
                            <v-col cols="12" md="7">
                                <table class="gn-combat-result-table">
                                    <colgroup>
                                        <col span="1" style="width: 40%" />
                                        <col span="1" style="width: 20%" />
                                        <col span="1" style="width: 20%" />
                                        <col span="1" style="width: 20%" />
                                    </colgroup>
                                    <thead>
                                        <th>Verteidiger</th>
                                        <th>Vorher</th>
                                        <th>Nachher</th>
                                        <th>Verluste</th>
                                    </thead>
                                    <tr v-for="UNIT in UNITS" :key="'dShip' + UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in ORB" :key="'dOrb' + UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in EXEN" :key="'dExe' + UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getExenBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getExenAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getExenLost(UNIT.ID)) }}</td>
                                    </tr>
                                </table>
                            </v-col>
                            <v-col cols="12" md="5">
                                <table class="gn-overview-table">
                                    <colgroup>
                                        <col span="1" style="width: 55%" />
                                        <col span="1" style="width: 45%" />
                                    </colgroup>
                                    <thead>
                                        <th colspan="2">Kosten</th>
                                    </thead>
                                    <tr v-for="RESOURCE in RESOURCES" :key="'dRes' + RESOURCE.ID">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(getDefenderCosts(RESOURCE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumDefenderCosts()) }}</td>
                                    </tr>
                                    <thead>
                                        <th colspan="2">Bergungsressourcen</th>
                                    </thead>
                                    <tr v-for="RESOURCE in RESOURCES" :key="'dBRes' + RESOURCE.ID + '1'">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(getDefenderBR(RESOURCE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumDefenderBR()) }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ getSumDefenderProfit() >= 0 ? 'Gewinn:' : 'Verlust:' }}</td>
                                        <td>{{ format(getSumDefenderProfit()) }}</td>
                                    </tr>
                                </table>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col>
                        <v-row>
                            <v-col cols="12" md="7">
                                <table class="gn-overview-table">
                                    <colgroup>
                                        <col span="1" style="width: 40%" />
                                        <col span="1" style="width: 20%" />
                                        <col span="1" style="width: 20%" />
                                        <col span="1" style="width: 20%" />
                                    </colgroup>
                                    <thead>
                                        <th>Angreifer</th>
                                        <th>Vorher</th>
                                        <th>Nachher</th>
                                        <th>Verluste</th>
                                    </thead>
                                    <tr v-for="UNIT in UNITS" :key="'aShip' + UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getAttackerBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getAttackerAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getAttackerLost(UNIT.ID)) }}</td>
                                    </tr>
                                </table>
                            </v-col>
                            <v-col cols="12" md="5">
                                <table class="gn-overview-table">
                                    <colgroup>
                                        <col span="1" style="width: 55%" />
                                        <col span="1" style="width: 45%" />
                                    </colgroup>
                                    <thead>
                                        <th colspan="2">Kosten</th>
                                    </thead>
                                    <tr v-for="RESOURCE in RESOURCES" :key="'aRes' + RESOURCE.ID">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(getAttackerCosts(RESOURCE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumAttackerCosts()) }}</td>
                                    </tr>
                                    <thead>
                                        <th colspan="2">Exen</th>
                                    </thead>
                                    <tr v-for="EXE in EXEN" :key="'aExe' + EXE.ID">
                                        <td>{{ EXE.NAME + ':' }}</td>
                                        <td>{{ format(getAttackerExenStolen(EXE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumAttackerExenStolen()) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kosten pro Exe:</td>
                                        <td>{{ format(getAttackerCostsPerExe()) }}</td>
                                    </tr>
                                </table>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th></th>
                        <th :colspan="before.attacker.length">Angreifer</th>
                        <th :colspan="before.defender.length">Verteidiger</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th v-for="attacker in before.attacker" :key="attacker.name">{{ attacker.name }}</th>
                        <th v-for="defender in before.defender" :key="defender.name">{{ defender.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="UNIT in UNITS" :key="UNIT.ID">
                        <td>{{ UNIT.NAME }}</td>
                        <td v-for="(attacker, aid) in before.attacker" :key="attacker.name">
                            {{ getAttackerUnit(aid, UNIT.ID) }}
                        </td>
                        <td v-for="(defender, did) in before.defender" :key="defender.name">
                            {{ getDefenderUnit(did, UNIT.ID) }}
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table> -->
    </div>
</template>
<script>
import config from '@/config.json'

export default {
    name: 'GnCombatResult',
    props: {
        result: function () {
            return {
                type: Object,
                default: {},
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

            let resultAttributs = this.result.data.attributes

            Object.keys(config.EXEN).forEach((exe) => {
                total.target.extractors.before[exe] = resultAttributs.target.extractors.before[exe]
            })

            if (resultAttributs.target) {
                //before
                resultAttributs.target.fleets.before.forEach((dfd) => {
                    Object.keys(dfd.units).forEach((u) => {
                        _this.add(total.target.fleets.before[0].units, u, dfd.units[u])
                    })
                })

                //after
                resultAttributs.target.fleets.after.forEach((dfd) => {
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

                Object.keys(config.EXEN).forEach((exe) => {
                    total.target.extractors.after[exe] = resultAttributs.target.extractors.after[exe]
                    total.target.extractors.stolen[exe] = resultAttributs.target.extractors.stolen[exe]
                })

                Object.keys(config.RESOURCES).forEach((res) => {
                    total.target.resources.salvaged[res] = resultAttributs.target.resources.salvaged[res]
                })
            }

            if (resultAttributs.defenders) {
                //before
                resultAttributs.defenders.forEach((dfd) => {
                    dfd.fleets.before.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.target.fleets.before[0].units, u, fleet.units[u])
                        })
                    })
                })

                //after
                resultAttributs.defenders.forEach((dfd) => {
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
            }

            if (resultAttributs.attackers) {
                //before
                resultAttributs.attackers.forEach((atk) => {
                    atk.fleets.before.forEach((fleet) => {
                        Object.keys(fleet.units).forEach((u) => {
                            _this.add(total.attackers[0].fleets.before[0].units, u, fleet.units[u])
                        })
                    })
                })

                //after
                resultAttributs.attackers.forEach((atk) => {
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

            return total
        },
        UNITS: function () {
            return config.UNITS
        },
        ORB: function () {
            return config.ORB
        },
        EXEN: function () {
            return config.EXEN
        },
        RESOURCES: function () {
            return config.RESOURCES
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        getExenBefore(unitId) {
            return this.total.target.extractors.before[unitId] ? this.total.target.extractors.before[unitId] : 0
        },
        getExenAfter(unitId) {
            return this.total.target.extractors.after[unitId] ? this.total.target.extractors.after[unitId] : 0
        },
        getExenLost(unitId) {
            return this.total.target.extractors.stolen[unitId] ? this.total.target.extractors.stolen[unitId] : 0
        },
        getDefenderBefore(unitId) {
            return this.total.target.fleets.before[0].units[unitId] ? this.total.target.fleets.before[0].units[unitId] : 0
        },
        getDefenderAfter(unitId) {
            return this.total.target.fleets.after[0].units[unitId] ? this.total.target.fleets.after[0].units[unitId] : 0
        },
        getDefenderLost(unitId) {
            return this.total.target.fleets.after[0].losses[unitId] ? this.total.target.fleets.after[0].losses[unitId] : 0
        },
        getDefenderCosts(ressourceId) {
            return this.total.target.fleets.after[0].resources.cost[ressourceId] ? this.total.target.fleets.after[0].resources.cost[ressourceId] : 0
        },
        getSumDefenderCosts() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((ressourceId) => {
                sum += _this.total.target.fleets.after[0].resources.cost[ressourceId] ? _this.total.target.fleets.after[0].resources.cost[ressourceId] : 0
            })
            return sum
        },
        getDefenderBR(ressourceId) {
            return this.total.target.resources.salvaged[ressourceId] ? this.total.target.resources.salvaged[ressourceId] : 0
        },
        getSumDefenderBR() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((ressourceId) => {
                sum += _this.total.target.resources.salvaged[ressourceId] ? _this.total.target.resources.salvaged[ressourceId] : 0
            })
            return sum
        },
        getSumDefenderProfit() {
            return this.getSumDefenderBR() - this.getSumDefenderCosts()
        },
        getAttackerBefore(unitId) {
            return this.total.attackers[0].fleets.before[0].units[unitId] ? this.total.attackers[0].fleets.before[0].units[unitId] : 0
        },
        getAttackerAfter(unitId) {
            return this.total.attackers[0].fleets.after[0].units[unitId] ? this.total.attackers[0].fleets.after[0].units[unitId] : 0
        },
        getAttackerLost(unitId) {
            return this.total.attackers[0].fleets.after[0].losses[unitId] ? this.total.attackers[0].fleets.after[0].losses[unitId] : 0
        },
        getAttackerCosts(ressourceId) {
            return this.total.attackers[0].fleets.after[0].resources.cost[ressourceId] ? this.total.attackers[0].fleets.after[0].resources.cost[ressourceId] : 0
        },
        getSumAttackerCosts() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((res) => {
                sum += _this.total.attackers[0].fleets.after[0].resources.cost[res] ? _this.total.attackers[0].fleets.after[0].resources.cost[res] : 0
            })
            return sum
        },
        getAttackerExenStolen(unitId) {
            return this.total.attackers[0].fleets.after[0].extractors.stolen[unitId] ? this.total.attackers[0].fleets.after[0].extractors.stolen[unitId] : 0
        },
        getSumAttackerExenStolen() {
            let _this = this
            let sum = 0
            Object.keys(config.EXEN).forEach((exe) => {
                sum += _this.total.attackers[0].fleets.after[0].extractors.stolen[exe] ? _this.total.attackers[0].fleets.after[0].extractors.stolen[exe] : 0
            })
            return sum
        },
        getAttackerCostsPerExe() {
            let exen = this.getSumAttackerExenStolen()
            if (exen > 0) {
                return Math.round(this.getSumAttackerCosts() / exen)
            } else {
                return 0
            }
        },
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
<style>
.gn-combat-result-table {
    width: 100%;
    text-align: right;
    border-collapse: collapse;
    font-size: 14px;
    color: black;
}
.gn-combat-result-table tr td:first-child {
    text-align: left;
}
.gn-combat-result-table thead th {
    border-bottom: 1px solid black;
    text-align: left;
}
</style>