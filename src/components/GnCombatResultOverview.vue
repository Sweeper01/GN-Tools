<template>
    <div v-show="total.data">
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
    </div>
</template>
<script>
import config from '@/config.json'

export default {
    name: 'GnCombatResultOverview',
    props: {
        total: function () {
            return {
                type: Object,
                default: {},
            }
        },
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
        before: function () {
            return this.total.data.attributes.before
        },
        after: function () {
            return this.total.data.attributes.after
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