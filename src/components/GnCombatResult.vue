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
                                    <tr v-for="UNIT in UNITS" :key="UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID) - getDefenderLost(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in ORB" :key="UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderBefore(UNIT.ID) - getDefenderLost(UNIT.ID)) }}</td>
                                        <td>{{ format(getDefenderLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in EXEN" :key="UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getTargetBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetAfter(UNIT.AFTER)) }}</td>
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
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(after.defender[0][RESOURCE.COST]) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumResourcesCost(after.defender[0])) }}</td>
                                    </tr>
                                    <thead>
                                        <th colspan="2">Bergungsressourcen</th>
                                    </thead>
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID + '1'">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(after.defender[0][RESOURCE.SALVAGE]) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumResourcesSalvage(after.defender[0])) }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ getCostSalveTotal() >= 0 ? 'Gewinn:' : 'Verlust:' }}</td>
                                        <td>{{ format(getCostSalveTotal()) }}</td>
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
                                    <tr v-for="UNIT in UNITS" :key="UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getAttackerBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getAttackerBefore(UNIT.ID) - getAttackerLost(UNIT.ID)) }}</td>
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
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(after.attacker[0][RESOURCE.COST]) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumResourcesCost(after.attacker[0])) }}</td>
                                    </tr>
                                    <thead>
                                        <th colspan="2">Exen</th>
                                    </thead>
                                    <tr v-for="EXE in EXEN" :key="EXE.ID">
                                        <td>{{ EXE.NAME + ':' }}</td>
                                        <td>{{ format(after.attacker[0][EXE.AFTERFALSE]) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumExen()) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kosten pro Exe:</td>
                                        <td>{{ format(getCostsPerExe()) }}</td>
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
        attributes: function () {
            return this.result.data.attributes
        },
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

            total.before.target.extractorsMetal = this.attributes.before.target.extractorsMetal
            total.before.target.extractorsCrystal = this.attributes.before.target.extractorsCrystal

            this.attributes.before.attacker.forEach((atk) => {
                for (let unitId in atk.units) {
                    let unit = atk.units[unitId]
                    if (total.before.attacker[0].units[unitId]) {
                        total.before.attacker[0].units[unitId] += unit
                    } else {
                        total.before.attacker[0].units[unitId] = unit
                    }
                }
            })
            this.attributes.before.defender.forEach((dfd) => {
                for (let unitId in dfd.units) {
                    let unit = dfd.units[unitId]
                    if (total.before.defender[0].units[unitId]) {
                        total.before.defender[0].units[unitId] += unit
                    } else {
                        total.before.defender[0].units[unitId] = unit
                    }
                }
            })

            total.after.target.extractorsMetal = this.attributes.after.target.extractorsMetal
            total.after.target.extractorsCrystal = this.attributes.after.target.extractorsCrystal
            total.after.target.stolenExtractorsMetal += this.attributes.after.target.stolenExtractorsMetal
            total.after.target.stolenExtractorsCrystal += this.attributes.after.target.stolenExtractorsCrystal

            this.attributes.after.attacker.forEach((atk) => {
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

            this.attributes.after.defender.forEach((dfd) => {
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

            let out = {
                data: {
                    type: 'combat-results',
                    attributes: total,
                },
            }
            return out
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
        before: function () {
            return this.total.data.attributes.before
            // return this.result.data.attributes.before
        },
        after: function () {
            return this.total.data.attributes.after
            // return this.result.data.attributes.after
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        getAttackerBefore(unitId) {
            return this.before.attacker[0].units[unitId] ? this.before.attacker[0].units[unitId] : 0
        },
        getAttackerLost(unitId) {
            return this.after.attacker[0].lostUnits[unitId] ? this.after.attacker[0].lostUnits[unitId] : 0
        },
        getDefenderBefore(unitId) {
            return this.before.defender[0].units[unitId] ? this.before.defender[0].units[unitId] : 0
        },
        getDefenderLost(unitId) {
            return this.after.defender[0].lostUnits[unitId] ? this.after.defender[0].lostUnits[unitId] : 0
        },
        getTargetBefore(unitId) {
            return this.before.target[unitId] ? this.before.target[unitId] : 0
        },
        getTargetAfter(unitId) {
            return this.after.target[unitId] ? this.after.target[unitId] : 0
        },
        getSumResourcesCost(fleet) {
            let sum = 0
            for (let ID in this.RESOURCES) {
                let RESOURCE = this.RESOURCES[ID]
                sum += fleet[RESOURCE.COST]
            }

            return sum
        },
        getSumResourcesSalvage(fleet) {
            let sum = 0
            for (let ID in this.RESOURCES) {
                let RESOURCE = this.RESOURCES[ID]
                sum += fleet[RESOURCE.SALVAGE]
            }

            return sum
        },
        getSumExen() {
            let sum = 0
            for (let ID in this.EXEN) {
                let EXE = this.EXEN[ID]
                sum += this.after.attacker[0][EXE.AFTERFALSE]
            }

            return sum
        },
        getCostsPerExe() {
            let exen = this.getSumExen()
            if (exen > 0) {
                return Math.round(this.getSumResourcesCost(this.after.attacker[0]) / exen)
            } else {
                return 0
            }
        },
        getCostSalveTotal() {
            let cost = this.getSumResourcesCost(this.after.defender[0])
            let br = this.getSumResourcesSalvage(this.after.defender[0])

            return br - cost
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