<template>
    <div class="gn-user">
        <div class="gn-user-header">
            <v-icon v-if="type == 1" small color="green" @click="changeType">mdi-shield</v-icon>
            <v-icon v-if="type == 2" small color="red" @click="changeType">mdi-sword-cross</v-icon>
            <span>{{ user.name + ' ' + getCoords }}</span>
        </div>
        <div class="gn-user-text">
            <div>
                <div v-if="Object.keys(user.fleet[fleet].units).length > 0">
                    <span class="gn-user-fleet-label">Flotte {{ fleet }}:</span>
                    <span class="gn-user-ship" v-for="(amount, id) in user.fleet[fleet].units" :key="id">{{ displayShip(id, amount) }}</span>
                </div>
            </div>
        </div>
        <div class="gn-user-footer">
            <span class="gn-user-footer-delay">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small v-bind="attrs" v-on="on">mdi-clock-start</v-icon>
                    </template>
                    <span>Startverzögerung in Ticks</span>
                </v-tooltip>

                <span>
                    <select class="gn-user-footer-select" v-model="delay">
                        <option v-for="(n, index) in 21" :key="index" :value="index">{{ index }}</option>
                    </select>
                </span>
            </span>
            <span class="gn-user-footer-duration">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small v-bind="attrs" v-on="on">mdi-clock-time-three-outline</v-icon>
                    </template>
                    <span>Aufenthaltszeit in Ticks</span>
                </v-tooltip>

                <span>
                    <select class="gn-user-footer-select" v-model="duration">
                        <option v-for="index in 20" :key="index" :value="index">{{ index }}</option>
                    </select>
                </span>
            </span>
        </div>
    </div>
</template>
<script>
import CONFIG from '@/config.json'

export default {
    name: 'GnUserFleet',
    components: {},
    props: {
        user: function () {
            return {
                type: Object,
                default: {},
            }
        },
        fleet: function () {
            return {
                type: Number,
                default: 1,
            }
        },
        type: function () {
            return {
                type: Number,
                default: 2,
            }
        },
    },
    // data: function() {
    //     return {
    //         duration: 1
    //     }
    // },
    computed: {
        duration: {
            set(duration) {
                this.$root.$emit('selectDuration', this.user.id, this.fleet, duration)
            },
            get() {
                return this.user.fleet[this.fleet].duration
            },
        },
        delay: {
            set(delay) {
                this.$root.$emit('selectDelay', this.user.id, this.fleet, delay)
            },
            get() {
                return this.user.fleet[this.fleet].delay
            },
        },
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
.gn-user-footer {
    border-top: 1px solid lightgrey;
}
.gn-user-footer span {
    padding: 2px 2px;
    font-weight: 800;
    font-size: 14px;
}
.gn-user-footer-delay {
    float: left;
}
.gn-user-footer-duration {
    float: right;
}
.gn-user-footer-select {
    padding: 0px 2px;
    text-align: center;
}
</style>