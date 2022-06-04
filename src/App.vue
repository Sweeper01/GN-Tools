<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col><h1>Flotten</h1></v-col>
                </v-row>
                <v-divider class="mb-5"></v-divider>
                <v-row>
                    <v-col v-for="scan in scans" :key="scan.id" cols="12" sm="4" md="3" lg="2">
                        <gn-scan :scan="scan" :type="scan.type"></gn-scan>
                    </v-col>
                    <v-col cols="12" sm="4" md="3" lg="2"><gn-add-fleet :add="addFleet"></gn-add-fleet></v-col>
                </v-row>
                <v-row class="mt-5">
                    <v-col cols="6" md="2">
                        <v-text-field v-model="ticks" type="Number" label="Anzahl Ticks"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-btn @click="simulate">Simulate</v-btn>
                    </v-col>
                </v-row>
                <v-divider class="mt-5"></v-divider>
                <gn-combat-results :results="results"></gn-combat-results>
                <v-divider class="mb-5"></v-divider>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import GnCombatResults from '@/components/GnCombatResults'
import GnAddFleet from '@/components/GnAddFleet'
import GnScan from '@/components/GnScan'
import config from '@/config.json'
import axios from 'axios'

import test from '@/test.json'
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
export default {
    name: 'App',

    components: {
        GnCombatResults,
        GnAddFleet,
        GnScan,
    },

    data: () => ({
        scan: '',
        scans: [],
        ticks: 5,
        results: [],
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
    },
    methods: {
        addFleet: function (scan) {
            this.scans.push(scan)
        },
        getFleet: function (id) {
            return this.scans.find((sc) => sc.id == id)
        },
        simulate: async function () {
            // let _this = this

            console.log('SIMULATE!')
            let cfg = {
                headers: {
                    Accept: 'application/vnd.api+json;version=1.0',
                    'Content-Type': 'application/json',
                },
            }

            let request = {
                data: {
                    type: 'combats',
                    attributes: {
                        target: {
                            fleets: [],
                            extractors: {
                                metal: 0,
                                crystal: 0,
                            },
                        },
                        attackers: [],
                        defenders: [],
                    },
                },
            }

            this.results = []
            for (let i = 0; i < this.ticks; i++) {
                try {
                    this.scans.forEach(function (scan) {
                        switch (scan.type) {
                            case 0:
                                request.data.attributes.target.name = "" + scan.id

                                Object.keys(config.EXEN).forEach((exe) => {
                                    request.data.attributes.target.extractors[exe] = parseInt(scan.exen[exe])
                                })

                                for (let f = 0; f <= 2; f++) {
                                    let fleet = {
                                        name: "" + f,
                                        units: f == 0 ? { ...scan.fleet[f].units, ...scan.orb } : { ...scan.fleet[f].units },
                                    }

                                    if (Object.keys(fleet.units).length > 0) {
                                        request.data.attributes.target.fleets.push(fleet)
                                    }
                                }
                                break
                            case 1:
                                let defender = {
                                    name: "" + scan.id,
                                    fleets: [],
                                }

                                for (let f = 0; f <= 2; f++) {
                                    let fleet = {
                                        name: "" + f,
                                        units: { ...scan.fleet[f].units },
                                        calculateCarrierCapacityLosses: i == scan.fleet[f].delay + scan.fleet[f].duration ? true : false,
                                    }

                                    if (i == scan.fleet[f].delay) {
                                        if (Object.keys(fleet.units).length > 0) {
                                            defender.fleets.push(fleet)
                                        }
                                    }
                                }

                                if (defender.fleets.length > 0) {
                                    request.data.attributes.defenders.push(defender)
                                }

                                break
                            case 2:
                                let attacker = {
                                    name: "" + scan.id,
                                    fleets: [],
                                }

                                for (let f = 0; f <= 2; f++) {
                                    let fleet = {
                                        name: "" + f,
                                        units: { ...scan.fleet[f].units },
                                        calculateCarrierCapacityLosses: i == scan.fleet[f].delay + scan.fleet[f].duration ? true : false,
                                    }

                                    if (i == scan.fleet[f].delay) {
                                        if (Object.keys(fleet.units).length > 0) {
                                            attacker.fleets.push(fleet)
                                        }
                                    }
                                }

                                if (attacker.fleets.length > 0) {
                                    request.data.attributes.attackers.push(attacker)
                                }
                                break
                        }
                    })

                    let response = await axios.post('https://galactic-conquest.de/api/combats', request, cfg)
                    let result = response.data
                    this.results.push({ tick: i + 1, data: result })

                    // request.data.attributes.target.extractorsMetal = result.data.attributes.after.target.extractorsMetal
                    // request.data.attributes.target.extractorsCrystal = result.data.attributes.after.target.extractorsCrystal
                    // request.data.attributes.attacker = result.data.attributes.after.attacker.filter(function (fleet) {
                    //     let name = fleet.name.split('%')
                    //     let id = name[0]
                    //     let fleetnr = name[1]
                    //     let scan = _this.getFleet(id)

                    //     let endtick = scan.fleet[fleetnr].delay + scan.fleet[fleetnr].duration

                    //     return i + 1 < endtick
                    // })
                    // request.data.attributes.defender = result.data.attributes.after.defender.filter(function (fleet) {
                    //     let name = fleet.name.split('%')
                    //     let id = name[0]
                    //     let fleetnr = name[1]
                    //     let scan = _this.getFleet(id)

                    //     if (scan.type == 0) {
                    //         return true
                    //     } else {
                    //         let endtick = scan.fleet[fleetnr].delay + scan.fleet[fleetnr].duration

                    //         return i + 1 < endtick
                    //     }
                    // })
                } catch (e) {
                    console.warn(e)
                }
            }
        },
    },
    mounted: function () {
        console.warn(test.SCANS)
        this.scans = test.SCANS

        let _this = this
        this.$root.$on('selectDuration', (id, fleet, duration) => {
            let scan = _this.scans.find((s) => s.id == id)
            scan.fleet[fleet].duration = duration
        })
        this.$root.$on('selectDelay', (id, fleet, delay) => {
            let scan = _this.scans.find((s) => s.id == id)
            scan.fleet[fleet].delay = delay
        })
        this.$root.$on('changeType', (id, type) => {
            console.warn(id)
            let newtype = type
            switch (type) {
                case 0:
                    newtype = 1
                    break
                case 1:
                    newtype = 2
                    break
                case 2:
                    newtype = 0
                    break
                default:
                    break
            }
            let scan = _this.scans.find((s) => s.id == id)
            if (scan) {
                console.warn(scan, scan.id, scan.name)
                scan.type = newtype
            }
        })
    },
}
</script>
<style>
</style>