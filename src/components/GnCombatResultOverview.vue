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
                                        <td>{{ format(getTargetBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in ORB" :key="UNIT.ID">
                                        <td>{{ UNIT.NAME }}</td>
                                        <td>{{ format(getTargetBefore(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetAfter(UNIT.ID)) }}</td>
                                        <td>{{ format(getTargetLost(UNIT.ID)) }}</td>
                                    </tr>
                                    <tr v-for="UNIT in EXEN" :key="UNIT.ID">
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
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(getTargetCosts(RESOURCE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumTargetCosts()) }}</td>
                                    </tr>
                                    <thead>
                                        <th colspan="2">Bergungsressourcen</th>
                                    </thead>
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID + '1'">
                                        <td>{{ RESOURCE.NAME + ':' }}</td>
                                        <td>{{ format(getTargetBR(RESOURCE.ID)) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Summe:</td>
                                        <td>{{ format(getSumTargetBR()) }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ getSumTargetProfit() >= 0 ? 'Gewinn:' : 'Verlust:' }}</td>
                                        <td>{{ format(getSumTargetProfit()) }}</td>
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
                                    <tr v-for="RESOURCE in RESOURCES" :key="RESOURCE.ID">
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
                                    <tr v-for="EXE in EXEN" :key="EXE.ID">
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
        attributes: function () {
            return this.total.data.attributes
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        getExenBefore(unitId) {
            return this.attributes.target.extractors.before[unitId] ? this.attributes.target.extractors.before[unitId] : 0
        },
        getExenAfter(unitId) {
            return this.attributes.target.extractors.after[unitId] ? this.attributes.target.extractors.after[unitId] : 0
        },
        getExenLost(unitId) {
            return this.attributes.target.extractors.stolen[unitId] ? this.attributes.target.extractors.stolen[unitId] : 0
        },
        getTargetBefore(unitId) {
            return this.attributes.target.fleets.before[0].units[unitId] ? this.attributes.target.fleets.before[0].units[unitId] : 0
        },
        getTargetAfter(unitId) {
            return this.attributes.target.fleets.after[0].units[unitId] ? this.attributes.target.fleets.after[0].units[unitId] : 0
        },
        getTargetLost(unitId) {
            return this.attributes.target.fleets.after[0].losses[unitId] ? this.attributes.target.fleets.after[0].losses[unitId] : 0
        },
        getTargetCosts(ressourceId) {
            return this.attributes.target.fleets.after[0].resources.cost[ressourceId] ? this.attributes.target.fleets.after[0].resources.cost[ressourceId] : 0
        },
        getSumTargetCosts() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((ressourceId) => {
                sum += _this.attributes.target.fleets.after[0].resources.cost[ressourceId] ? _this.attributes.target.fleets.after[0].resources.cost[ressourceId] : 0
            })
            return sum
        },
        getTargetBR(ressourceId) {
            return this.attributes.target.resources.salvaged[ressourceId] ? this.attributes.target.resources.salvaged[ressourceId] : 0
        },
        getSumTargetBR() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((ressourceId) => {
                sum += _this.attributes.target.resources.salvaged[ressourceId] ? _this.attributes.target.resources.salvaged[ressourceId] : 0
            })
            return sum
        },
        getSumTargetProfit() {
            return this.getSumTargetBR() - this.getSumTargetCosts()
        },
        getAttackerBefore(unitId) {
            return this.attributes.attackers[0].fleets.before[0].units[unitId] ? this.attributes.attackers[0].fleets.before[0].units[unitId] : 0
        },
        getAttackerAfter(unitId) {
            return this.attributes.attackers[0].fleets.after[0].units[unitId] ? this.attributes.attackers[0].fleets.after[0].units[unitId] : 0
        },
        getAttackerLost(unitId) {
            return this.attributes.attackers[0].fleets.after[0].losses[unitId] ? this.attributes.attackers[0].fleets.after[0].losses[unitId] : 0
        },
        getAttackerCosts(ressourceId) {
            return this.attributes.attackers[0].fleets.after[0].resources.cost[ressourceId] ? this.attributes.attackers[0].fleets.after[0].resources.cost[ressourceId] : 0
        },
        getSumAttackerCosts() {
            let _this = this
            let sum = 0
            Object.keys(config.RESOURCES).forEach((res) => {
                sum += _this.attributes.attackers[0].fleets.after[0].resources.cost[res] ? _this.attributes.attackers[0].fleets.after[0].resources.cost[res] : 0
            })
            return sum
        },
        getAttackerExenStolen(unitId) {
            return this.attributes.attackers[0].fleets.after[0].extractors.stolen[unitId] ? this.attributes.attackers[0].fleets.after[0].extractors.stolen[unitId] : 0
        },
        getSumAttackerExenStolen() {
            let _this = this
            let sum = 0
            Object.keys(config.EXEN).forEach((exe) => {
                sum += _this.attributes.attackers[0].fleets.after[0].extractors.stolen[exe] ? _this.attributes.attackers[0].fleets.after[0].extractors.stolen[exe] : 0
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