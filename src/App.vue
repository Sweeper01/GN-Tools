<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col><h1>Flotten</h1></v-col>
                </v-row>
                <v-divider class="mb-5"></v-divider>
                <v-row>
                    <v-col v-for="user in users" :key="user.id" cols="12" sm="4" md="3" lg="2">
                        <gn-user :user="user" :type="user.type" :deleteUser="deleteUser"></gn-user>
                    </v-col>
                    <v-col cols="12" sm="4" md="3" lg="2"><gn-add-fleet :add="addUser"></gn-add-fleet></v-col>
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
import GnUser from '@/components/GnUser'
import config from '@/config.json'
import axios from 'axios'

// import test from '@/test.json'
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
export default {
    name: 'App',

    components: {
        GnCombatResults,
        GnAddFleet,
        GnUser,
    },

    data: () => ({
        user: '',
        users: [],
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
        getNewRequestObj: function () {
            return {
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
        },
        getNewTargetObj: function (id) {
            return {
                name: '' + id,
                fleets: [],
                extractors: {
                    metal: 0,
                    crystal: 0,
                },
            }
        },
        getNewUserObj: function (id) {
            return {
                name: '' + id,
                fleets: [],
            }
        },
        addUser: function (user) {
            this.users.push(user)
        },
        deleteUser: function (user) {
            let index = this.users.findIndex((u) => u.id == user.id)
            this.users.splice(index,1)
        },
        getUserByID: function (id) {
            return this.users.find((u) => u.id == id)
        },
        getNewUsers: function (tick) {
            let _this = this

            let users = {
                target: undefined,
                attackers: [],
                defenders: [],
            }

            this.users.forEach(function (user) {
                switch (user.type) {
                    case 0:
                        if (tick == 0) {
                            let target = _this.getNewTargetObj(user.id)

                            Object.keys(config.EXEN).forEach((exe) => {
                                target.extractors[exe] = user.exen[exe] ? parseInt(user.exen[exe]) : 0
                            })

                            for (let f = 0; f <= 2; f++) {
                                let fleet = {
                                    name: '' + f,
                                    units: f == 0 ? { ...user.fleet[f].units, ...user.orb } : { ...user.fleet[f].units },
                                }

                                if (Object.keys(fleet.units).length > 0) {
                                    target.fleets.push(fleet)
                                }
                            }

                            users.target = target
                        }
                        break
                    case 1:
                        let defender = _this.getNewUserObj(user.id)

                        for (let f = 0; f <= 2; f++) {
                            let fleet = {
                                name: '' + f,
                                units: { ...user.fleet[f].units },
                                calculateCarrierCapacityLosses: user.fleet[f].delay + user.fleet[f].duration == tick + 1 ? true : false,
                            }

                            if (user.fleet[f].delay == tick) {
                                if (Object.keys(fleet.units).length > 0) {
                                    defender.fleets.push(fleet)
                                }
                            }
                        }

                        if (defender.fleets.length > 0) {
                            users.defenders.push(defender)
                        }

                        break
                    case 2:
                        let attacker = _this.getNewUserObj(user.id)

                        for (let f = 0; f <= 2; f++) {
                            let fleet = {
                                name: '' + f,
                                units: { ...user.fleet[f].units },
                                calculateCarrierCapacityLosses: user.fleet[f].delay + user.fleet[f].duration == tick + 1 ? true : false,
                            }

                            if (user.fleet[f].delay == tick) {
                                if (Object.keys(fleet.units).length > 0) {
                                    attacker.fleets.push(fleet)
                                }
                            }
                        }

                        if (attacker.fleets.length > 0) {
                            users.attackers.push(attacker)
                        }
                        break
                }
            })

            return users
        },
        getNextRequest: function (result, tick) {
            let _this = this

            let request = this.getNewRequestObj()

            //new Users
            let users = this.getNewUsers(tick)
            if (users.target) {
                request.data.attributes.target = users.target
            }
            request.data.attributes.defenders = users.defenders
            request.data.attributes.attackers = users.attackers

            //From last Request
            if (result) {
                let attributes = result.data.attributes

                if (attributes.target) {
                    attributes.target.fleets.after.forEach((fleet) => {
                        request.data.attributes.target.fleets.push({
                            name: fleet.name,
                            units: fleet.units,
                        })
                    })

                    Object.keys(config.EXEN).forEach((exe) => {
                        request.data.attributes.target.extractors[exe] = attributes.target.extractors.after[exe]
                    })
                }

                if (attributes.defenders) {
                    attributes.defenders.forEach((dfd) => {
                        let defender = this.getNewUserObj(dfd.name)

                        dfd.fleets.after.forEach((fleet) => {
                            let user = _this.getUserByID(dfd.name)
                            let endtick = user.fleet[fleet.name].delay + user.fleet[fleet.name].duration

                            if (tick == endtick) {
                                return
                            }

                            if (user.fleet[fleet.name].delay + user.fleet[fleet.name].duration > tick) {
                                defender.fleets.push({
                                    name: fleet.name,
                                    units: { ...fleet.units },
                                    calculateCarrierCapacityLosses: user.fleet[fleet.name].delay + user.fleet[fleet.name].duration == tick + 1 ? true : false,
                                })
                            }
                        })

                        if (defender.fleets.length > 0) {
                            request.data.attributes.defenders.push(defender)
                        }
                    })
                }
                if (attributes.attackers) {
                    attributes.attackers.forEach((atk) => {
                        let attacker = this.getNewUserObj(atk.name)

                        atk.fleets.after.forEach((fleet) => {
                            let user = _this.getUserByID(atk.name)
                            let endtick = user.fleet[fleet.name].delay + user.fleet[fleet.name].duration

                            if (tick == endtick) {
                                return
                            }

                            if (user.fleet[fleet.name].delay + user.fleet[fleet.name].duration > tick) {
                                attacker.fleets.push({
                                    name: fleet.name,
                                    units: { ...fleet.units },
                                    calculateCarrierCapacityLosses: user.fleet[fleet.name].delay + user.fleet[fleet.name].duration == tick + 1 ? true : false,
                                })
                            }
                        })

                        if (attacker.fleets.length > 0) {
                            request.data.attributes.attackers.push(attacker)
                        }
                    })
                }
            }

            return request
        },
        simulate: async function () {
            // let _this = this
            let cfg = {
                headers: {
                    Accept: 'application/vnd.api+json;version=1.0',
                    'Content-Type': 'application/json',
                },
            }

            this.results = []
            let lastResult = undefined

            for (let i = 0; i < this.ticks; i++) {
                try {
                    let request = this.getNextRequest(lastResult, i)

                    let response = await axios.post('https://galactic-conquest.de/api/combats', request, cfg)

                    lastResult = response.data
                    this.results.push({ tick: i + 1, request: request, response: lastResult })
                } catch (e) {
                    console.warn(e)
                }
            }
        },
    },
    mounted: function () {
        // console.warn(test.SCANS)
        // this.users = test.SCANS

        let _this = this
        this.$root.$on('selectDuration', (id, fleet, duration) => {
            let user = _this.users.find((u) => u.id == id)
            user.fleet[fleet].duration = duration
        })
        this.$root.$on('selectDelay', (id, fleet, delay) => {
            let user = _this.users.find((u) => u.id == id)
            user.fleet[fleet].delay = delay
        })
        this.$root.$on('changeType', (id, type) => {
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
            let user = _this.users.find((u) => u.id == id)
            if (user) {
                user.type = newtype
            }
        })
    },
}
</script>
<style>
</style>