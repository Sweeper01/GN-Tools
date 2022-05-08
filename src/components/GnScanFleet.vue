<template>
    <div class="gn-scan">
        <div class="gn-scan-header">
            <v-icon v-if="type == 1" small color="green" @click="changeType">mdi-shield</v-icon>
            <v-icon v-if="type == 2" small color="red" @click="changeType">mdi-sword-cross</v-icon>
            <span>{{ scan.name + ' ' + getCoords }}</span>
        </div>
        <div class="gn-scan-text">
            <div>
                <div v-if="Object.keys(scan.fleet[fleet].units).length > 0">
                    <span class="gn-scan-fleet-label">Flotte {{ fleet }}:</span>
                    <span class="gn-scan-ship" v-for="(amount, id) in scan.fleet[fleet].units" :key="id">{{ displayShip(id, amount) }}</span>
                </div>
            </div>
        </div>
        <div class="gn-scan-footer">
            <span class="gn-scan-footer-delay">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small v-bind="attrs" v-on="on">mdi-clock-start</v-icon>
                    </template>
                    <span>Startverzögerung in Ticks</span>
                </v-tooltip>

                <span>
                    <select class="gn-scan-footer-select" v-model="delay">
                        <option v-for="(n, index) in 21" :key="index" :value="index">{{ index }}</option>
                    </select>
                </span>
            </span>
            <span class="gn-scan-footer-duration">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small v-bind="attrs" v-on="on">mdi-clock-time-three-outline</v-icon>
                    </template>
                    <span>Aufenthaltszeit in Ticks</span>
                </v-tooltip>

                <span>
                    <select class="gn-scan-footer-select" v-model="duration">
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
    name: 'GnScanFleet',
    components: {},
    props: {
        scan: function () {
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
                this.$root.$emit('selectDuration', this.scan.id, this.fleet, duration)
            },
            get() {
                return this.scan.fleet[this.fleet].duration
            },
        },
        delay: {
            set(delay) {
                this.$root.$emit('selectDelay', this.scan.id, this.fleet, delay)
            },
            get() {
                return this.scan.fleet[this.fleet].delay
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

            if (this.scan.galaxy) {
                cords = '(' + this.scan.galaxy + ':' + this.scan.nr + ')'
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
            this.$root.$emit('changeType', this.scan.id, this.type)
        },
    },
}
</script>
<style>
.gn-scan {
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
.gn-scan-header {
    padding-left: 5px;
    border-bottom: 1px solid lightgrey;
}
.gn-scan-header span {
    padding: 2px 5px;
    font-weight: 800;
    font-size: 14px;
}
.gn-scan-text {
    padding: 5px;
    font-size: 12px;
}
.gn-scan-fleet-label {
    font-weight: 800;
}
.gn-scan-ship {
    padding-left: 2px;
}
.gn-scan-exen {
    font-weight: 800;
    padding-left: 2px;
    padding-right: 2px;
}
.gn-scan-footer {
    border-top: 1px solid lightgrey;
}
.gn-scan-footer span {
    padding: 2px 2px;
    font-weight: 800;
    font-size: 14px;
}
.gn-scan-footer-delay {
    float: left;
}
.gn-scan-footer-duration {
    float: right;
}
.gn-scan-footer-select {
    padding: 0px 2px;
    text-align: center;
}
</style>