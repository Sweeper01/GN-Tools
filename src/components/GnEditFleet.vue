<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay persistent>
        <v-card tile>
            <v-toolbar>
                <v-toolbar-title>Flotte editieren</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="submit()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-row class="mt-5">
                    <v-col>
                        <v-row>
                            <v-col>
                                <v-btn-toggle v-model="user.type" tile mandatory>
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
                                    v-model="user.fleet[0].units[unit.ID]"
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
                                    v-model="user.orb[orb.ID]"
                                    :label="orb.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                    v-show="user.type == 0"
                                >
                                </v-text-field>
                                <v-text-field
                                    class="mb-1"
                                    v-for="exe in EXEN"
                                    :key="exe.ID"
                                    v-model="user.exen[exe.ID]"
                                    :label="exe.NAME"
                                    dense
                                    outlined
                                    hide-details
                                    type="Number"
                                    min="0"
                                    v-show="user.type == 0"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <h1 class="mb-3">Flotte 1</h1>

                                <v-text-field
                                    class="mb-1"
                                    v-for="unit in UNITS"
                                    :key="unit.ID"
                                    v-model="user.fleet[1].units[unit.ID]"
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
                                    v-model="user.fleet[2].units[unit.ID]"
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
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-row>
                    <v-col cols="12">
                        <v-btn block text @click="submit">Schließen</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import config from '@/config.json'

export default {
    name: 'GnEditFleet',
    props: {
        value: Object,
        show: {
            type: Boolean,
            default: false,
        },
        close: {
            type: Function,
            default: function () {},
        },
    },
    data: function () {
        return {
            dialog: false,
        }
    },
    watch: {
        show(newShow) {
            if (newShow) {
                this.dialog = true
            }
            if (!newShow) {
                this.dialog = false
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
        user: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            },
        },
    },
    methods: {
        setDuration: function (duration) {
            this.user.fleet[1].duration = duration
            this.user.fleet[2].duration = duration
        },
        clean: function (user) {
            for (let i = 0; i < 3; i++) {
                Object.keys(user.fleet[i].units).forEach((u) => (user.fleet[i].units[u] == 0 || user.fleet[i].units[u] == '') && delete user.fleet[i].units[u])
                Object.keys(user.fleet[i].units).forEach((u) => (user.fleet[i].units[u] = parseInt(user.fleet[i].units[u])))
            }

            Object.keys(user.orb).forEach((u) => (user.orb[u] == 0 || user.orb[u] == '') && delete user.orb[u])
            Object.keys(user.orb).forEach((u) => (user.orb[u] = parseInt(user.orb[u])))

            return user
        },
        submit: function () {
            if (this.user.id.length == 0) {
                this.user.id = this.$GNNames.getName()
            }

            this.user = this.clean(this.user)

            this.close()
        },
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