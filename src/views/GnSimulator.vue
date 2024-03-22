<template>
    <div>
        <v-snackbar :value="alert" dense top centered timeout="2000" color="green">Link kopiert </v-snackbar>
        <v-row>
            <v-col cols="12">
                <v-btn-toggle v-model="mode" mandatory tile class="gn-sim-mode">
                    <v-btn>Simple</v-btn>
                    <v-btn>Advanced</v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <v-container>
            <div v-show="mode == 0">
                <v-row>
                    <v-col cols="12" md="6">
                        <h1 class="mb-3">Verteidiger</h1>
                        <v-text-field
                            class="mb-1"
                            v-for="unit in UNITS"
                            :key="unit.ID"
                            v-model="simple_deff.fleet[0].units[unit.ID]"
                            :label="unit.NAME"
                            dense
                            outlined
                            hide-details
                            type="Number"
                            min="0"
                        >
                        </v-text-field>

                        <v-text-field
                            class="mb-1"
                            v-for="orb in ORB"
                            :key="orb.ID"
                            v-model="simple_deff.orb[orb.ID]"
                            :label="orb.NAME"
                            dense
                            outlined
                            hide-details
                            type="Number"
                            min="0"
                        >
                        </v-text-field>
                        <v-text-field
                            class="mb-1"
                            v-for="exe in EXEN"
                            :key="exe.ID"
                            v-model="simple_deff.exen[exe.ID]"
                            :label="exe.NAME"
                            dense
                            outlined
                            hide-details
                            type="Number"
                            min="0"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <h1 class="mb-3">Angreifer</h1>
                        <v-text-field
                            class="mb-1"
                            v-for="unit in UNITS"
                            :key="unit.ID"
                            v-model="simple_off.fleet[1].units[unit.ID]"
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
            </div>
            <div v-show="mode == 1">
                <v-row>
                    <v-col><h1>Flotten</h1></v-col>
                </v-row>
                <v-divider class="mb-5"></v-divider>
                <v-row>
                    <v-col v-for="(user, index) in users" :key="user.id" cols="12" sm="4" md="3" lg="2">
                        <gn-user v-model="users[index]" :type="user.type" :deleteUser="deleteUser"></gn-user>
                    </v-col>
                    <v-col cols="12" sm="4" md="3" lg="2"><gn-add-fleet :add="addUser"></gn-add-fleet></v-col>
                </v-row>
            </div>
            <v-row class="mt-5">
                <v-col cols="6" md="2">
                    <v-text-field v-model="ticks" type="Number" label="Anzahl Ticks"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-btn @click="simulate">Simulate</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn text x-small @click="copyURL">Link teilen</v-btn>
                </v-col>
            </v-row>

            <v-divider class="mt-5"></v-divider>
            <gn-combat-results :results="results"></gn-combat-results>
            <v-divider class="mb-5"></v-divider>
        </v-container>
    </div>
</template>

<script>
import GnCombatResults from '@/components/GnCombatResults'
import GnAddFleet from '@/components/GnAddFleet'
import GnUser from '@/components/GnUser'
import config from '@/config.json'
import gnKs from '@/plugins/kampfsystem/gnKs.js'

/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
export default {
    name: 'GnSimulator',

    components: {
        GnCombatResults,
        GnAddFleet,
        GnUser,
    },

    data: () => ({
        // user: '',
        mode: 0,
        users: [],
        ticks: 5,
        results: [],
        alert: false,
        simple_deff: {
            id: 'sd999',
            name: 'Verteidiger',
            type: 0,
            exen: {},
            orb: {},
            fleet: {
                0: { units: {} },
                1: { units: {}, delay: 0, duration: 20 },
                2: { units: {}, delay: 0, duration: 20 },
            },
        },
        simple_off: {
            id: 'so999',
            name: 'Angreifer',
            type: 2,
            exen: {},
            orb: {},
            fleet: {
                0: { units: {} },
                1: { units: {}, delay: 0, duration: 5 },
                2: { units: {}, delay: 0, duration: 5 },
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
        url: function () {
            let url = location.origin + location.pathname
            if (this.users.length > 0) {
                let json = JSON.stringify(this.users)
                let base = btoa(json)
                url = url + '?a=' + base
            }
            return url
        },
    },
    methods: {
        clean: function (user) {
            for (let i = 0; i < 3; i++) {
                Object.keys(user.fleet[i].units).forEach((u) => (user.fleet[i].units[u] == 0 || user.fleet[i].units[u] == '') && delete user.fleet[i].units[u])
                Object.keys(user.fleet[i].units).forEach((u) => (user.fleet[i].units[u] = parseInt(user.fleet[i].units[u])))
            }

            Object.keys(user.orb).forEach((u) => (user.orb[u] == 0 || user.orb[u] == '') && delete user.orb[u])
            Object.keys(user.orb).forEach((u) => (user.orb[u] = parseInt(user.orb[u])))

            return user
        },
        copyURL: async function () {
            try {
                await navigator.clipboard.writeText(this.url)
                this.alert = true
            } catch ($e) {
                console.warn('kopieren fehlgeschlagen')
            }
        },
        getNewRequestObj: function (mode = 0) {
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
                        config: {
                            mode: mode,
                        },
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
            this.users.splice(index, 1)
        },
        getUserByID: function (id) {
            return this.users.find((u) => u.id == id)
        },
        getCombatMode: function (fleet) {
            let mode = 0
            if (fleet) {
                Object.keys(fleet.units).forEach((u) => {
                    if (config.ORB[u] && config.ORB[u].PRETICKS && config.ORB[u].PRETICKS > mode) {
                        mode = config.ORB[u].PRETICKS
                    }
                })
            }
            return mode
        },
        updateUsers: function (users, lastResult) {
            if (lastResult && lastResult.data.attributes.attackers) {
                lastResult.data.attributes.attackers.forEach((atk) => {
                    let userIndex = users.findIndex((u) => u.id == atk.name)
                    if (userIndex > -1) {
                        atk.fleets.after.forEach((f) => {
                            Object.keys(users[userIndex].fleet).forEach((uf) => {
                                if (uf == f.name) {
                                    users[userIndex].fleet[uf].units = f.units
                                }
                            })
                        })
                    }
                })
            }
            if (lastResult && lastResult.data.attributes.target) {
                let userIndex = users.findIndex((u) => u.id == lastResult.data.attributes.target.name)
                if (userIndex > -1) {
                    let oldUser = users[userIndex]
                    let user = lastResult.data.attributes.target

                    let target = {
                        id: oldUser.id,
                        name: oldUser.name,
                        type: oldUser.type,
                        exen: {},
                        orb: {},
                        fleet: {
                            0: {},
                            1: {},
                            2: {},
                        },
                    }

                    Object.keys(config.EXEN).forEach((exe) => {
                        target.exen[exe] = user.extractors.after[exe]
                    })

                    lastResult.data.attributes.target.fleets.after.forEach((fleet) => {
                        let oldFleet = oldUser.fleet[fleet.name]

                        let newFleet = {
                            units: {},
                            delay: oldFleet.delay,
                            duration: oldFleet.duration,
                        }

                        Object.keys(fleet.units).forEach((unit) => {
                            if (config.ORB[unit]) {
                                target.orb[unit] = fleet.units[unit]
                            } else {
                                newFleet.units[unit] = fleet.units[unit]
                            }
                        })

                        target.fleet[fleet.name] = newFleet
                    })

                    users[userIndex] = target
                }
            }
        },
        getPreTickUsers: function (users, tick) {
            let _this = this

            let newUsers = {
                target: undefined,
                attackers: [],
                defenders: [],
            }

            users.forEach(function (user) {
                switch (user.type) {
                    case 0:
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

                        newUsers.target = target
                        break
                    case 1:
                        break
                    case 2:
                        let attacker = _this.getNewUserObj(user.id)

                        for (let f = 0; f <= 2; f++) {
                            let calculateCarrierCapacityLosses = tick + 1 >= _this.ticks ? true : user.fleet[f].delay + user.fleet[f].duration == tick + 1 ? true : false
                            let fleet = {
                                name: '' + f,
                                units: { ...user.fleet[f].units },
                                calculateCarrierCapacityLosses: calculateCarrierCapacityLosses,
                            }

                            if (user.fleet[f].delay == tick) {
                                if (Object.keys(fleet.units).length > 0) {
                                    attacker.fleets.push(fleet)
                                }
                            }
                        }

                        if (attacker.fleets.length > 0) {
                            newUsers.attackers.push(attacker)
                        }
                        break
                }
            })

            return newUsers
        },
        getNewUsers: function (users, tick) {
            let _this = this

            let newUsers = {
                target: undefined,
                attackers: [],
                defenders: [],
            }

            users.forEach(function (user) {
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

                            newUsers.target = target
                        }
                        break
                    case 1:
                        let defender = _this.getNewUserObj(user.id)

                        for (let f = 0; f <= 2; f++) {
                            let calculateCarrierCapacityLosses = tick + 1 >= _this.ticks ? true : user.fleet[f].delay + user.fleet[f].duration == tick + 1 ? true : false
                            let fleet = {
                                name: '' + f,
                                units: { ...user.fleet[f].units },
                                calculateCarrierCapacityLosses: calculateCarrierCapacityLosses,
                            }

                            if (user.fleet[f].delay == tick) {
                                if (Object.keys(fleet.units).length > 0) {
                                    defender.fleets.push(fleet)
                                }
                            }
                        }

                        if (defender.fleets.length > 0) {
                            newUsers.defenders.push(defender)
                        }

                        break
                    case 2:
                        let attacker = _this.getNewUserObj(user.id)

                        for (let f = 0; f <= 2; f++) {
                            let calculateCarrierCapacityLosses = tick + 1 >= _this.ticks ? true : user.fleet[f].delay + user.fleet[f].duration == tick + 1 ? true : false
                            let fleet = {
                                name: '' + f,
                                units: { ...user.fleet[f].units },
                                calculateCarrierCapacityLosses: calculateCarrierCapacityLosses,
                            }

                            if (user.fleet[f].delay == tick) {
                                if (Object.keys(fleet.units).length > 0) {
                                    attacker.fleets.push(fleet)
                                }
                            }
                        }

                        if (attacker.fleets.length > 0) {
                            newUsers.attackers.push(attacker)
                        }
                        break
                }
            })

            return newUsers
        },
        getNextPreTickRequest: function (newUsers, mode) {
            let request = this.getNewRequestObj(mode)

            //new Users
            request.data.attributes.target = newUsers.target
            request.data.attributes.attackers = request.data.attributes.attackers.concat(newUsers.attackers)

            return request
        },
        getNextRequest: function (result, tick, newUsers, mode) {
            let _this = this

            let request = this.getNewRequestObj(mode)

            //new Users
            if (newUsers.target && !result) {
                request.data.attributes.target = newUsers.target
            }
            request.data.attributes.defenders = newUsers.defenders
            request.data.attributes.attackers = newUsers.attackers

            //From last Request
            if (result) {
                let attributes = result.data.attributes

                if (attributes.target) {
                    request.data.attributes.target.name = attributes.target.name
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
                                let calculateCarrierCapacityLosses =
                                    tick + 1 >= _this.ticks ? true : user.fleet[fleet.name].delay + user.fleet[fleet.name].duration == tick + 1 ? true : false
                                defender.fleets.push({
                                    name: fleet.name,
                                    units: { ...fleet.units },
                                    calculateCarrierCapacityLosses: calculateCarrierCapacityLosses,
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
                        let atkIndex = newUsers.attackers.findIndex((a) => a.name == atk.name)

                        let attacker = this.getNewUserObj(atk.name)

                        atk.fleets.after.forEach((fleet) => {
                            let fleetIndex = -1
                            if (atkIndex > -1) {
                                fleetIndex = newUsers.attackers[atkIndex].fleets.findIndex((f) => f.name == fleet.name)
                            }

                            if (fleetIndex > -1) {
                                return
                            }

                            let user = _this.getUserByID(atk.name)
                            let endtick = user.fleet[fleet.name].delay + user.fleet[fleet.name].duration

                            if (tick == endtick) {
                                return
                            }

                            if (user.fleet[fleet.name].delay + user.fleet[fleet.name].duration > tick) {
                                let calculateCarrierCapacityLosses =
                                    tick + 1 >= _this.ticks ? true : user.fleet[fleet.name].delay + user.fleet[fleet.name].duration == tick + 1 ? true : false
                                attacker.fleets.push({
                                    name: fleet.name,
                                    units: { ...fleet.units },
                                    calculateCarrierCapacityLosses: calculateCarrierCapacityLosses,
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
            console.log('simulate')

            // let _this = this
            if (this.mode == 0) {
                this.users = []
                this.users.push(this.clean(this.simple_deff))
                this.users.push(this.clean(this.simple_off))
            }

            let cfg = {
                headers: {
                    Accept: 'application/vnd.api+json;version=1.0',
                    'Content-Type': 'application/json',
                },
            }

            let combatUsers = JSON.parse(JSON.stringify(this.users))

            let newUsers = this.getNewUsers(combatUsers, 0)
            let mode = this.getCombatMode(newUsers.target.fleets[0])

            this.results = []
            let lastResult = undefined
            let request = undefined
            let response = undefined

            for (let i = -2; i < this.ticks; i++) {
                try {
                    let newUsers

                    //Pre Ticks
                    if (lastResult) {
                        mode = this.getCombatMode(lastResult.data.attributes.target.fleets.after[0])
                    }

                    if (mode > 1) {
                        //Pre Tick 2
                        newUsers = this.getPreTickUsers(combatUsers, i + 2)
                        if (newUsers.attackers.length > 0) {
                            request = this.getNextPreTickRequest(newUsers, 2)
                            // response = await axios.post('https://galactic-conquest.de/api/combats', request, cfg)
                            // this.updateUsers(combatUsers, response.data)
                            // this.results.push({ tick: i + 1, request: request, response: response.data, mode: 2 })
                            response = gnKs.execute(request)
                            this.updateUsers(combatUsers, response)
                            this.results.push({ tick: i + 1, request: request, response: response, mode: 2 })
                        }
                    }
                    if (mode > 0) {
                        //Pre Tick 1
                        newUsers = this.getPreTickUsers(combatUsers, i + 1)
                        if (newUsers.attackers.length > 0) {
                            request = this.getNextPreTickRequest(newUsers, 1)
                            // response = await axios.post('https://galactic-conquest.de/api/combats', request, cfg)
                            // this.updateUsers(combatUsers, response.data)
                            // this.results.push({ tick: i + 1, request: request, response: response.data, mode: 1 })
                            response = gnKs.execute(request)
                            this.updateUsers(combatUsers, response)
                            this.results.push({ tick: i + 1, request: request, response: response, mode: 1 })
                        }
                    }

                    //Main Combat Tick
                    newUsers = this.getNewUsers(combatUsers, i)
                    if ((newUsers.target || newUsers.defenders.length > 0 || newUsers.attackers.length > 0 || lastResult) && i >= 0) {
                        request = this.getNextRequest(lastResult, i, newUsers, 0)
                        // response = await axios.post('https://galactic-conquest.de/api/combats', request, cfg)
                        // lastResult = response.data
                        // this.updateUsers(combatUsers, response.data)
                        response = gnKs.execute(request)
                        lastResult = response
                        this.updateUsers(combatUsers, response)
                        this.results.push({ tick: i + 1, request: request, response: lastResult, mode: 0 })
                    }
                } catch (e) {
                    console.warn(e)
                }
            }
        },
    },
    created: function () {
        let _this = this
        let uri = window.location.search.substring(1)
        let params = new URLSearchParams(uri)
        let a = params.get('a')
        if (a) {
            let json = atob(a)
            this.users = JSON.parse(json)
            this.mode = 1
            this.users.forEach((u) => _this.$GNNames.addName(u.id))
        }
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
.gn-sim-mode {
    width: 100%;
}
.gn-sim-mode .v-btn {
    width: 50%;
}
</style>