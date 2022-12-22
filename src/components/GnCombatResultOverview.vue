<template>
    <div v-show="results.length > 0">
        <v-card class="gn-overview">
            <v-card-text>
                <v-row>
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
                                    <thead>
                                        <th colspan="2">per User</th>
                                    </thead>
                                    <tr v-for="dfd in defenders" :key="'dBResUser' + dfd.id">
                                        <td>{{ dfd.id }}</td>
                                        <td>{{ format(getDefenderProfit(dfd)) }}</td>
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
                                    <tr v-for="UNIT in UNITS" :key="'aShips' + UNIT.ID">
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
                                    <thead>
                                        <th colspan="2">per User</th>
                                    </thead>
                                    <tr v-for="atk in attackers" :key="'aExeUser' + atk.id">
                                        <td>{{ atk.id }}</td>
                                        <td>{{ format(getSumAttackerExenStolenPerUser(atk)) + ' x ' + format(getAttackerCostsPerExePerUser(atk)) }}</td>
                                    </tr>
                                </table>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import config from '@/config.json'

export default {
    name: 'GnCombatResultOverview',
    props: {
        results: function () {
            return {
                type: Array,
                default: [],
            }
        },
    },
    data: function () {
        return {
            defenders: [],
            attackers: [],
        }
    },
    computed: {
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
        total: function () {
            let _this = this
            _this.defenders = []
            _this.attackers = []
            // let users = []

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
                let response = this.results[i].response.data.attributes

                if (response.target) {
                    let user = _this.defenders.find((u) => u.id == response.target.name)
                    if (!user) {
                        user = _this.getNewUserObj(response.target.name)
                        _this.defenders.push(user)
                    }
                    //before
                    if (i == 0) {
                        Object.keys(config.EXEN).forEach((exe) => {
                            total.target.extractors.before[exe] = response.target.extractors.before[exe]
                        })

                        response.target.fleets.before.forEach((tgt) => {
                            Object.keys(tgt.units).forEach((u) => {
                                _this.add(total.target.fleets.before[0].units, u, tgt.units[u])
                            })
                        })
                    }

                    //after
                    response.target.fleets.after.forEach((tgt) => {
                        // Object.keys(tgt.units).forEach((u) => {
                        //     _this.add(total.target.fleets.after[0].units, u, tgt.units[u])
                        // })

                        Object.keys(tgt.losses).forEach((u) => {
                            _this.add(total.target.fleets.after[0].losses, u, tgt.losses[u])
                            _this.add(user.losses, u, tgt.losses[u])
                        })

                        Object.keys(tgt.destroyed).forEach((u) => {
                            _this.add(total.target.fleets.after[0].destroyed, u, tgt.destroyed[u])
                        })

                        Object.keys(config.RESOURCES).forEach((res) => {
                            // _this.add(total.target.fleets.after[0].resources.salvaged, res, tgt.resources.salvaged[res])
                            _this.add(total.target.fleets.after[0].resources.cost, res, tgt.resources.cost[res])
                            _this.add(user.cost, res, tgt.resources.cost[res])
                        })
                    })

                    Object.keys(config.EXEN).forEach((exe) => {
                        total.target.extractors.after[exe] = response.target.extractors.after[exe]
                        _this.add(total.target.extractors.stolen, exe, response.target.extractors.stolen[exe])
                    })

                    Object.keys(config.RESOURCES).forEach((res) => {
                        _this.add(total.target.resources.salvaged, res, response.target.resources.salvaged[res])
                        _this.add(user.salvaged, res, response.target.resources.salvaged[res])
                    })
                }

                //Defenders nur beim neu auftauchen
                if (response.defenders) {
                    //before
                    response.defenders.forEach((dfd) => {
                        let user = _this.defenders.find((u) => u.id == dfd.name)
                        if (!user) {
                            user = _this.getNewUserObj(dfd.name)
                            _this.defenders.push(user)
                        }
                        dfd.fleets.before.forEach((fleet) => {
                            if (!user.fleets.find((f) => f == fleet.name)) {
                                user.fleets.push(fleet.name)

                                Object.keys(fleet.units).forEach((u) => {
                                    _this.add(total.target.fleets.before[0].units, u, fleet.units[u])
                                })
                            }
                        })
                    })

                    //after
                    response.defenders.forEach((dfd) => {
                        let user = _this.defenders.find((u) => u.id == dfd.name)
                        dfd.fleets.after.forEach((fleet) => {
                            // Object.keys(fleet.units).forEach((u) => {
                            //     _this.add(total.target.fleets.after[0].units, u, fleet.units[u])
                            // })

                            Object.keys(fleet.losses).forEach((u) => {
                                _this.add(total.target.fleets.after[0].losses, u, fleet.losses[u])
                                _this.add(user.losses, u, fleet.losses[u])
                            })

                            Object.keys(fleet.destroyed).forEach((u) => {
                                _this.add(total.target.fleets.after[0].destroyed, u, fleet.destroyed[u])
                            })

                            Object.keys(config.RESOURCES).forEach((res) => {
                                _this.add(total.target.resources.salvaged, res, fleet.resources.salvaged[res])
                                _this.add(total.target.fleets.after[0].resources.cost, res, fleet.resources.cost[res])
                                _this.add(user.salvaged, res, fleet.resources.salvaged[res])
                                _this.add(user.cost, res, fleet.resources.cost[res])
                            })
                        })
                    })
                }

                if (response.attackers) {
                    //before
                    response.attackers.forEach((atk) => {
                        let user = _this.attackers.find((u) => u.id == atk.name)
                        if (!user) {
                            user = _this.getNewUserObj(atk.name)
                            _this.attackers.push(user)
                        }

                        atk.fleets.before.forEach((fleet) => {
                            if (!user.fleets.find((f) => f == fleet.name)) {
                                user.fleets.push(fleet.name)

                                Object.keys(fleet.units).forEach((u) => {
                                    _this.add(total.attackers[0].fleets.before[0].units, u, fleet.units[u])
                                })
                            }
                        })
                    })

                    //after
                    response.attackers.forEach((atk) => {
                        let user = _this.attackers.find((u) => u.id == atk.name)
                        atk.fleets.after.forEach((fleet) => {
                            // Object.keys(fleet.units).forEach((u) => {
                            //     _this.add(total.attackers[0].fleets.after[0].units, u, fleet.units[u])
                            // })

                            Object.keys(fleet.losses).forEach((u) => {
                                _this.add(total.attackers[0].fleets.after[0].losses, u, fleet.losses[u])
                                _this.add(user.losses, u, fleet.losses[u])
                            })

                            Object.keys(fleet.destroyed).forEach((u) => {
                                _this.add(total.attackers[0].fleets.after[0].destroyed, u, fleet.destroyed[u])
                            })

                            Object.keys(config.RESOURCES).forEach((res) => {
                                // _this.add(total.attackers[0].fleets.after[0].resources.salvaged, res, fleet.resources.salvaged[res])
                                _this.add(total.attackers[0].fleets.after[0].resources.cost, res, fleet.resources.cost[res])
                                _this.add(user.cost, res, fleet.resources.cost[res])
                            })

                            Object.keys(config.EXEN).forEach((exe) => {
                                _this.add(total.attackers[0].fleets.after[0].extractors.stolen, exe, fleet.extractors.stolen[exe])
                                _this.add(user.stolen, exe, fleet.extractors.stolen[exe])
                            })
                        })
                    })
                }
            }

            return total
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
            return this.getDefenderBefore(unitId) - this.getDefenderLost(unitId)
            // return this.total.target.fleets.after[0].units[unitId] ? this.total.target.fleets.after[0].units[unitId] : 0
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
        getDefenderProfit(dfd) {
            let cost = 0
            let salvaged = 0
            Object.keys(config.RESOURCES).forEach((ressourceId) => {
                cost += dfd.cost[ressourceId] ? dfd.cost[ressourceId] : 0
                salvaged += dfd.salvaged[ressourceId] ? dfd.salvaged[ressourceId] : 0
            })
            return salvaged - cost
        },
        getAttackerBefore(unitId) {
            return this.total.attackers[0].fleets.before[0].units[unitId] ? this.total.attackers[0].fleets.before[0].units[unitId] : 0
        },
        getAttackerAfter(unitId) {
            return this.getAttackerBefore(unitId) - this.getAttackerLost(unitId)
            // return this.total.attackers[0].fleets.after[0].units[unitId] ? this.total.attackers[0].fleets.after[0].units[unitId] : 0
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
        getSumAttackerExenStolenPerUser(atk) {
            let exen = 0
            Object.keys(config.EXEN).forEach((exe) => {
                exen += atk.stolen[exe] ? atk.stolen[exe] : 0
            })
            return exen
        },
        getAttackerCostsPerExePerUser(atk) {
            let costs = 0
            Object.keys(config.RESOURCES).forEach((res) => {
                costs += atk.cost[res] ? atk.cost[res] : 0
            })
            let exen = this.getSumAttackerExenStolenPerUser(atk)
            if (exen > 0) {
                return Math.round(costs / exen)
            } else {
                return 0
            }
        },
        getNewUserObj(name) {
            return { id: name, fleets: [], losses: {}, cost: {}, stolen: {}, salvaged: {} }
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
.gn-overview-table {
    width: 100%;
    text-align: right;
    border-collapse: collapse;
    font-size: 14px;
    color: black;
}
.gn-overview-table tr td:first-child {
    text-align: left;
}
.gn-overview-table thead th {
    border-bottom: 1px solid black;
    text-align: left;
}
</style>