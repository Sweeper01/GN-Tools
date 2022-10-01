<template>
    <div>
        <!-- v-if="type == 0"  -->
        <gn-edit-fleet :close="closeEdit" v-model="user" :show="showEdit"></gn-edit-fleet>
        <div class="gn-user">
            <div class="gn-user-header">
                <v-row no-gutters>
                    <v-col class="gn-user-header-label">
                        <v-icon v-if="type == 0" small color="green" @click="changeType">mdi-shield-home</v-icon>
                        <v-icon v-if="type == 1" small color="green" @click="changeType">mdi-shield</v-icon>
                        <v-icon v-if="type == 2" small color="red" @click="changeType">mdi-sword-cross</v-icon>
                        <span @click="showEdit = true">{{ getUserName }}</span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-icon class="gn-user-delete-button" small right @click="deleteUser(user)">mdi-close-circle-outline</v-icon>
                    </v-col>
                </v-row>
            </div>
            <div class="gn-user-body">
                <!-- v-if="type == 0 && (Object.keys(user.exen).length > 0 || Object.keys(user.orb).length > 0 || Object.keys(user.fleet[0].units).length > 0)" -->
                <v-row no-gutters>
                    <v-col>
                        <div v-if="type == 0 && user.points">
                            <span class="gn-user-label">Punkte:</span>
                            <span class="gn-user-ship">{{ displayPoints(user.points) }}</span>
                        </div>
                        <div v-if="type == 0 && Object.keys(user.exen).length > 0">
                            <span class="gn-user-label">Exen:</span>
                            <span class="gn-user-ship" v-for="(amount, id) in user.exen" :key="id">{{ displayExen(id, amount) }}</span>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col>
                        <div v-if="type == 0 && Object.keys(user.orb).length > 0">
                            <span class="gn-user-label">Geschütze:</span>
                            <span class="gn-user-ship" v-for="(amount, id) in user.orb" :key="id">{{ displayOrb(id, amount) }}</span>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col>
                        <div v-if="type == 0 && Object.keys(user.fleet[0].units).length > 0">
                            <span class="gn-user-label">Orbit:</span>
                            <span class="gn-user-ship" v-for="(amount, id) in user.fleet[0].units" :key="id">{{ displayShip(id, amount) }}</span>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col>
                        <div v-if="Object.keys(user.fleet[1].units).length > 0">
                            <span class="gn-user-label">Flotte 1:</span>
                            <span class="gn-user-ship" v-for="(amount, id) in user.fleet[1].units" :key="id">{{ displayShip(id, amount) }}</span>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters v-if="type != 0 && Object.keys(user.fleet[1].units).length > 0">
                    <v-col>
                        <gn-user-fleet-settings :user="user" :fleet="1"></gn-user-fleet-settings>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col>
                        <div v-if="Object.keys(user.fleet[2].units).length > 0">
                            <span class="gn-user-label">Flotte 2:</span>
                            <span class="gn-user-ship" v-for="(amount, id) in user.fleet[2].units" :key="id">{{ displayShip(id, amount) }}</span>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters v-if="type != 0 && Object.keys(user.fleet[2].units).length > 0">
                    <v-col>
                        <gn-user-fleet-settings :user="user" :fleet="2"></gn-user-fleet-settings>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>
<script>
import CONFIG from '@/config.json'
import GnEditFleet from '@/components/GnEditFleet'
import GnUserFleetSettings from '@/components/GnUserFleetSettings'

export default {
    name: 'GnUser',
    components: { GnUserFleetSettings, GnEditFleet },
    props: {
        value: Object,
        type: function () {
            return {
                type: Number,
                default: 2,
            }
        },
        deleteUser: {
            type: Function,
            default: function () {},
        },
    },
    data: function () {
        return {
            showEdit: false,
        }
    },
    computed: {
        UNITS: function () {
            return CONFIG.UNITS
        },
        ORB: function () {
            return CONFIG.ORB
        },
        EXEN: function () {
            return CONFIG.EXEN
        },
        user: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            },
        },
        getUserName: function () {
            let name = ''
            if (this.user.name) {
                name = this.user.name
            } else {
                name = this.user.id + ''
            }

            if (this.user.galaxy) {
                name += '\xa0' + '(' + this.user.galaxy + ':' + this.user.nr + ')'
            }

            // name = "123456789012345678901234567890"
            name = name.substring(0, 16)

            return name
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        displayShip: function (id, amount) {
            if (amount > 0) {
                return ' ' + this.format(amount) + '\xa0' + this.UNITS[id].SHORT
            }
        },
        displayOrb: function (id, amount) {
            if (amount > 0) {
                return ' ' + this.format(amount) + '\xa0' + this.ORB[id].SHORT
            }
        },
        displayPoints: function (amount) {
            return ' ' + this.format(amount)
        },
        displayExen: function (id, amount) {
            return ' ' + this.format(amount) + '\xa0' + this.EXEN[id].SHORT
        },
        changeType() {
            this.$root.$emit('changeType', this.user.id, this.type)
        },
        closeEdit: function () {
            // this.user = user
            this.showEdit = false
        },
    },
}
</script>
<style>
.gn-user {
    display: inline-block;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    border-radius: 4px;
}
/* .gn-attacker {
    background-color: #ff8080;
}
.gn-defender {
    background-color: #80ffaa;
} */
.gn-user-header {
    position: relative;
    padding: 0px 5px;
    border-bottom: 1px solid lightgrey;
}
.gn-user-header-label {
    display: flex;
    flex-direction: row;
}
.gn-user-header span {
    padding: 3px 17px 2px 5px;
    font-weight: 800;
    font-size: 12px;
    float: left;
}
.gn-user-delete-button {
    position: absolute !important;
    padding: 4px;
    top: 0;
    right: 0;
}
.gn-user-body {
    padding: 2px 5px 5px 5px;
    font-size: 12px;
}
.gn-user-body .row {
    padding-top: 1px;
}
.gn-user-label {
    font-weight: 800;
}
/* .gn-user-fleet {
    padding: 2px 5px;
    font-size: 12px;
    border-top: 1px solid lightgrey;
} */
.gn-user-ship {
    padding-left: 2px;
}
.gn-user-exen {
    font-weight: 800;
    padding-left: 2px;
    padding-right: 2px;
}
</style>