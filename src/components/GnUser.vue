<template>
    <div>
        <div v-if="type == 0" class="gn-user">
            <div class="gn-user-header">
                <v-icon small color="green" @click="changeType">mdi-shield-home</v-icon>
                <span>{{ user.name + ' ' + getCoords }}</span>
            </div>
            <div class="gn-user-text">
                <div>
                    <div v-if="type == 0 && Object.keys(user.exen).length > 0">
                        <span class="gn-user-fleet-label">Exen:</span>
                        <span class="gn-user-ship" v-for="(amount, id) in user.exen" :key="id">{{ displayExen(id, amount) }}</span>
                    </div>
                    <div v-if="type == 0 && Object.keys(user.orb).length > 0">
                        <span class="gn-user-fleet-label">Geschütze:</span>
                        <span class="gn-user-ship" v-for="(amount, id) in user.orb" :key="id">{{ displayOrb(id, amount) }}</span>
                    </div>
                    <div v-if="type == 0 && Object.keys(user.fleet[0].units).length > 0">
                        <span class="gn-user-fleet-label">Orbit:</span>
                        <span class="gn-user-ship" v-for="(amount, id) in user.fleet[0].units" :key="id">{{ displayShip(id, amount) }}</span>
                    </div>
                    <div v-if="Object.keys(user.fleet[1].units).length > 0">
                        <span class="gn-user-fleet-label">Flotte 1:</span>
                        <span class="gn-user-ship" v-for="(amount, id) in user.fleet[1].units" :key="id">{{ displayShip(id, amount) }}</span>
                    </div>
                    <div v-if="Object.keys(user.fleet[2].units).length > 0">
                        <span class="gn-user-fleet-label">Flotte 2:</span>
                        <span class="gn-user-ship" v-for="(amount, id) in user.fleet[2].units" :key="id">{{ displayShip(id, amount) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="type != 0">
            <div v-for="index in 2" :key="index">
                <v-row v-if="Object.keys(user.fleet[index].units).length > 0">
                    <v-col>
                        <gn-user-fleet :user="user" :fleet="index" :type="type"></gn-user-fleet>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>
<script>
import CONFIG from '@/config.json'
import GnUserFleet from '@/components/GnUserFleet'

export default {
    name: 'GnUser',
    components: { GnUserFleet },
    props: {
        user: function () {
            return {
                type: Object,
                default: {},
            }
        },
        type: function () {
            return {
                type: Number,
                default: 2,
            }
        },
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
        getCoords: function () {
            let cords = ''

            if (this.user.galaxy) {
                cords = '(' + this.user.galaxy + ':' + this.user.nr + ')'
            }

            return cords
        },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        displayShip: function (id, amount) {
            return ' ' + this.format(amount) + '\xa0' + this.UNITS[id].SHORT
        },
        displayOrb: function (id, amount) {
            return ' ' + this.format(amount) + '\xa0' + this.ORB[id].SHORT
        },
        displayExen: function (id, amount) {
            return ' ' + this.format(amount) + '\xa0' + this.EXEN[id].SHORT
        },
        changeType() {
            this.$root.$emit('changeType', this.user.id, this.type)
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
    padding-left: 5px;
    border-bottom: 1px solid lightgrey;
}
.gn-user-header span {
    padding: 2px 5px;
    font-weight: 800;
    font-size: 14px;
}
.gn-user-text {
    padding: 5px;
    font-size: 12px;
}
.gn-user-fleet-label {
    font-weight: 800;
}
.gn-user-ship {
    padding-left: 2px;
}
.gn-user-exen {
    font-weight: 800;
    padding-left: 2px;
    padding-right: 2px;
}
</style>