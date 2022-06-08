<template>
    <div class="gn-user-fleet-settings">
        <span class="gn-user-fleet-settings-delay">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on">mdi-clock-start</v-icon>
                </template>
                <span>Startverzögerung in Ticks</span>
            </v-tooltip>

            <span>
                <select class="gn-user-fleet-settings-select" v-model="delay">
                    <option v-for="(n, index) in 21" :key="index" :value="index">{{ index }}</option>
                </select>
            </span>
        </span>
        <span class="gn-user-fleet-settings-duration">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on">mdi-clock-time-three-outline</v-icon>
                </template>
                <span>Aufenthaltszeit in Ticks</span>
            </v-tooltip>

            <span>
                <select class="gn-user-fleet-settings-select" v-model="duration">
                    <option v-for="index in 20" :key="index" :value="index">{{ index }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script>
// import CONFIG from '@/config.json'

export default {
    name: 'GnUserFleetSettings',
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
        // UNITS: function () {
        //     return CONFIG.UNITS
        // },
    },
    methods: {
        format(number) {
            return Number(number).toLocaleString()
        },
        displayShip: function (id, amount) {
            return ' ' + this.format(amount) + '\xa0' + this.UNITS[id].SHORT
        },
    },
}
</script>
<style>
/* .gn-user-fleet-settings {
    border: 1px solid lightgray;
    border-radius: 4px;
} */
.gn-user-fleet-settings span {
    /* padding: 2px 2px; */
    font-weight: 800;
    font-size: 12px;
}
.gn-user-fleet-settings-delay {
    padding: 1px;
    float: left;
    border: 1px solid lightgray;
    border-radius: 4px;
}
.gn-user-fleet-settings-duration {
    padding: 1px;
    float: right;
    border: 1px solid lightgray;
    border-radius: 4px;
}
.gn-user-fleet-settings-select {
    padding: 0px 2px;
    text-align: center;
}
</style>