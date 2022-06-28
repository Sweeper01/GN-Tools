<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn height="100%" color="primary" dark icon tile x-large v-bind="attrs" v-on="on"><v-icon x-large>mdi-plus-box</v-icon></v-btn>
        </template>
        <v-card tile>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Flotte hinzufügen</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="close()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col>
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
                        <v-row>
                            <v-col>
                                <v-btn-toggle v-model="scan.type" color="primary" tile mandatory>
                                    <v-btn><v-icon color="green">mdi-shield-home</v-icon><span class="d-none d-sm-flex">Ziel</span></v-btn>
                                    <v-btn @click="setDuration(20)"><v-icon color="green">mdi-shield</v-icon><span class="d-none d-sm-flex">Verteidiger</span></v-btn>
                                    <v-btn @click="setDuration(5)"><v-icon color="red">mdi-sword-cross</v-icon><span class="d-none d-sm-flex">Angreifer</span></v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4">
                                <h1 class="mb-3">Orbit</h1>
                                <v-text-field
                                    class="mb-1"
                                    v-for="unit in UNITS"
                                    :key="unit.ID"
                                    v-model="scan.fleet[0].units[unit.ID]"
                                    :label="unit.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                    :disabled="scan.type != 0"
                                >
                                </v-text-field>

                                <v-text-field
                                    class="mb-1"
                                    v-for="orb in ORB"
                                    :key="orb.ID"
                                    v-model="scan.orb[orb.ID]"
                                    :label="orb.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                    v-show="scan.type == 0"
                                >
                                </v-text-field>
                                <v-text-field
                                    class="mb-1"
                                    v-for="exe in EXEN"
                                    :key="exe.ID"
                                    v-model="scan.exen[exe.ID]"
                                    :label="exe.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                    v-show="scan.type == 0"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h1 class="mb-3">Flotte 1</h1>

                                <v-text-field
                                    class="mb-1"
                                    v-for="unit in UNITS"
                                    :key="unit.ID"
                                    v-model="scan.fleet[1].units[unit.ID]"
                                    :label="unit.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h1 class="mb-3">Flotte 2</h1>
                                <v-text-field
                                    class="mb-1"
                                    v-for="unit in UNITS"
                                    :key="unit.ID"
                                    v-model="scan.fleet[2].units[unit.ID]"
                                    :label="unit.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!-- <v-row>
                                <v-col cols="12">
                                    <h1 class="mb-1 mt-5">Aufteilung ändern</h1>
                                </v-col>
                                <v-col v-if="fleet.type == 2">
                                    <v-btn @click="setFleetTo('BC')">Bash + Cleps</v-btn>
                                    <v-btn @click="setFleetTo('CO')">Cleponly</v-btn>
                                </v-col>
                            </v-row> -->
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-row>
                    <v-col cols="4">
                        <v-btn color="error" block text @click="close">Abbrechen</v-btn>
                    </v-col>
                    <v-col cols="8">
                        <v-btn color="primary" block text @click="submit">Flotte hinzufügen</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import config from '@/config.json'
import GNParser from '@/plugins/gnparser.js'

export default {
    name: 'GnAddFleet',
    props: {
        add: {
            type: Function,
            default: function () {},
        },
    },
    data: function () {
        return {
            dialog: false,
            scanText: '',
            scan: {
                id: '',
                name: '',
                type: 0,
                exen: {},
                orb: {},
                fleet: {
                    0: { units: {} },
                    1: { units: {}, delay: 0, duration: 20 },
                    2: { units: {}, delay: 0, duration: 20 },
                },
            },
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
    },
    methods: {
        setDuration: function (duration) {
            this.scan.fleet[1].duration = duration
            this.scan.fleet[2].duration = duration
        },
        parse: async function () {
            this.scan = GNParser.parse(this.scanText, this.scan)

            await this.$forceUpdate()

            console.warn(this.scan)
        },
        reset: function () {
            this.scanText = ''
            this.scan = {
                id: '',
                name: '',
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
        close: function () {
            this.dialog = false

            this.reset()
        },
        clean: function (scan) {
            for (let i = 0; i < 3; i++) {
                Object.keys(scan.fleet[i].units).forEach((u) => (scan.fleet[i].units[u] == 0 || scan.fleet[i].units[u] == '') && delete scan.fleet[i].units[u])
                Object.keys(scan.fleet[i].units).forEach((u) => (scan.fleet[i].units[u] = parseInt(scan.fleet[i].units[u])))
            }

            Object.keys(scan.orb).forEach((u) => (scan.orb[u] == 0 || scan.orb[u] == '') && delete scan.orb[u])
            Object.keys(scan.orb).forEach((u) => (scan.orb[u] = parseInt(scan.orb[u])))

            return scan
        },
        submit: function () {
            if (this.scan.id.length == 0) {
                this.scan.id = Date.now()
            }

            this.scan = this.clean(this.scan)

            this.add(this.scan)

            this.close()
        },
        // setFleetTo: async function (type) {

        //     console.warn(type)
        //     let fleet = this.fleet
        //     config.FLEETTYPES[type].ORBIT.forEach((unit) => {
        //         if (fleet.fleet1[unit]) {
        //             let ships = parseInt(fleet.fleet1[unit], 10)
        //             delete fleet.fleet1[unit]
        //             if (fleet.orbit[unit]) {
        //                 ships += parseInt(fleet.orbit[unit], 10)
        //             }
        //             fleet.orbit[unit] = ships
        //         }
        //         if (fleet.fleet2[unit]) {
        //             let ships = parseInt(fleet.fleet2[unit], 10)
        //             delete fleet.fleet2[unit]
        //             if (fleet.orbit[unit]) {
        //                 ships += parseInt(fleet.orbit[unit], 10)
        //             }
        //             fleet.orbit[unit] = ships
        //         }
        //     })
        //     config.FLEETTYPES[type].FLEET1.forEach((unit) => {
        //         if (fleet.orbit[unit]) {
        //             let ships = parseInt(fleet.orbit[unit], 10)
        //             delete fleet.orbit[unit]
        //             if (fleet.fleet1[unit]) {
        //                 ships += parseInt(fleet.fleet1[unit], 10)
        //             }
        //             fleet.fleet1[unit] = ships
        //         }
        //         if (fleet.fleet2[unit]) {
        //             let ships = parseInt(fleet.fleet2[unit], 10)

        //             delete fleet.fleet2[unit]
        //             if (fleet.fleet1[unit]) {
        //                 ships += parseInt(fleet.fleet1[unit], 10)
        //             }
        //             fleet.fleet1[unit] = ships
        //         }
        //     })
        //     config.FLEETTYPES[type].FLEET2.forEach((unit) => {
        //         if (fleet.orbit[unit]) {
        //             let ships = parseInt(fleet.orbit[unit], 10)

        //             delete fleet.orbit[unit]
        //             if (fleet.fleet2[unit]) {
        //                 ships += parseInt(fleet.fleet2[unit], 10)
        //             }
        //             fleet.fleet2[unit] = ships
        //         }
        //         if (fleet.fleet1[unit]) {
        //             let ships = parseInt(fleet.fleet1[unit], 10)

        //             delete fleet.fleet1[unit]
        //             if (fleet.fleet2[unit]) {
        //                 ships += parseInt(fleet.fleet2[unit], 10)
        //             }
        //             fleet.fleet2[unit] = ships
        //         }
        //     })

        //     // this.$set(this, 'fleet', fleet)

        //      console.warn(this.fleet)
        // },
    },
}
</script>
<style>
.gn-parse-input textarea {
    font-size: 10px;
    line-height: 120% !important;
}
.gn-parse-button {
    height: 100%;
    display: flex;
    align-items: center;
}
</style>