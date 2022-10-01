<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h1 class="mb-1 mt-5">Scan einlesen</h1>
                </v-col>
                <v-col cols="12" md="4">
                    <v-textarea class="gn-parse-input" v-model="scanText" clearable dense></v-textarea>
                </v-col>
                <v-col cols="12" md="2">
                    <div class="gn-parse-button">
                        <v-btn @click="parse()" width="100%" tile>Parse</v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row v-if="showParse">
                <v-col cols="12" sm="6" md="4">
                    <gn-user v-model="user" :type="user.type" :deleteUser="deleteUser"></gn-user>
                </v-col>
            </v-row>
            <v-divider class="mt-5"></v-divider>

            <v-row class="mt-3">
                <v-col cols="12" sm="6" md="4" v-if="user.points">
                    <v-card>
                        <v-card-title>Ressourcenberechnung</v-card-title>
                        <v-card-text>
                            <table class="gn-ressourcen-info">
                                <tr>
                                    <td>Punkte durch Exen:</td>
                                    <td>{{ format(pointsFromExen) }}</td>
                                </tr>
                                <tr>
                                    <td>Punkte durch Orb:</td>
                                    <td>{{ format(pointsFromOrb) }}</td>
                                </tr>
                                <tr>
                                    <td>Punkte durch Schiffe:</td>
                                    <td class="gn-ressourcen-info-line">{{ format(pointsFromShips) }}</td>
                                </tr>
                                <tr>
                                    <td>Gesamtpunkte:</td>
                                    <td>{{ format(totalPoints) }}</td>
                                </tr>
                                <tr>
                                    <td>Punkte laut Scan:</td>
                                    <td class="gn-ressourcen-info-line">{{ format(user.points) }}</td>
                                </tr>
                                <tr>
                                    <td>Punkte durch Ress:</td>
                                    <td>{{ format(pointsFromRes) }}</td>
                                </tr>
                                <tr>
                                    <td>Ressourcen:</td>
                                    <td class="gn-ressourcen-info-line">{{ format(ressources) }}</td>
                                </tr>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="pointsPerTick.length">
                    <v-card>
                        <v-card-title>Punkteberechnung</v-card-title>
                        <v-card-text>
                            <table class="gn-ressourcen-info">
                                <tr v-for="ppt in pointsPerTick" :key="ppt.tick">
                                    <td>ETA {{ getETA(ppt.tick) }}</td>
                                    <td>{{ format(ppt.points) }}</td>
                                </tr>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import GnUser from '@/components/GnUser'
import GNParser from '@/plugins/gnparser.js'
import config from '@/config.json'
import moment from 'moment'

// import test from '@/test.json'
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
export default {
    name: 'GnScanAuswertung',

    components: {
        GnUser,
    },

    data: () => ({
        scanText: '',
        showParse: false,
        user: {
            id: '',
            name: '',
            points: 0,
            type: 0,
            exen: {},
            orb: {},
            fleet: {
                0: { units: {} },
                1: { units: {}, delay: 0, duration: 20 },
                2: { units: {}, delay: 0, duration: 20 },
            },
        },
    }),
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
        pointsFromExen: function () {
            let points = 0
            let exen = this.user.exen
            Object.keys(config.EXEN).forEach((exe) => {
                if (exen[exe]) {
                    points += exen[exe] * 15000
                }
            })

            return points
        },
        pointsFromOrb: function () {
            let points = 0
            let orbs = this.user.orb
            console.warn(config.ORB)
            Object.keys(config.ORB).forEach((key) => {
                const ORB = config.ORB[key]
                if (orbs[ORB.ID]) {
                    points += orbs[ORB.ID] * (ORB.CRYSTAL + ORB.METAL)
                }
            })

            console.warn(points)
            return points
        },
        pointsFromShips: function () {
            let points = 0
            let user = this.user

            for (let i = 0; i < 3; i++) {
                Object.keys(user.fleet[i].units).forEach((u) => (points += user.fleet[i].units[u] * (config.UNITS[u].CRYSTAL + config.UNITS[u].METAL)))
            }

            return points
        },
        totalPoints: function () {
            return this.pointsFromExen + this.pointsFromOrb + this.pointsFromShips
        },
        pointsFromRes: function () {
            return this.user.points - this.totalPoints
        },
        ressources: function () {
            return this.pointsFromRes * 10
        },
        pointsPerTick: function () {
            let points = []

            if (this.showParse) {
                if (this.user.points) {
                    let lastpoints = parseInt(this.user.points)
                    points.push({
                        tick: 0,
                        points: lastpoints,
                    })

                    let addedPoints = 0
                    let exen = this.user.exen
                    Object.keys(config.EXEN).forEach((exe) => {
                        if (exen[exe]) {
                            addedPoints += exen[exe] * 50
                        }
                    })

                    for (let i = 1; i <= 30; i++) {
                        lastpoints += addedPoints
                        points.push({
                            tick: i,
                            points: lastpoints,
                        })
                    }
                }
            }

            return points
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        getETA(tick) {
            let time = moment().hour(7).minute(30)

            return time.subtract(15 * tick, 'minutes').format('H:mm')
        },
        parse: async function () {
            this.user = GNParser.parse(this.scanText, this.user)
            this.showParse = true
            await this.$forceUpdate()

            console.warn(this.user)
        },
        deleteUser: async function () {
            this.showParse = false
            this.user = {
                id: '',
                name: '',
                points: 0,
                type: 0,
                exen: {},
                orb: {},
                fleet: {
                    0: { units: {} },
                    1: { units: {}, delay: 0, duration: 20 },
                    2: { units: {}, delay: 0, duration: 20 },
                },
            }
        },
    },
}
</script>
<style>
.gn-ressourcen-info {
    width: 100%;
    border-collapse: collapse;
}
.gn-ressourcen-info td:not(:first-child) {
    text-align: right;
}
.gn-ressourcen-info-line {
    border-bottom: 1px solid black;
}
</style>