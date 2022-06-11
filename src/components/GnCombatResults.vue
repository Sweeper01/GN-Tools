<template>
    <div v-show="results.length > 0">
        <h1 class="mt-5">Übersicht</h1>
        <v-divider></v-divider>
        <gn-combat-result-overview :results="results"></gn-combat-result-overview>
        <div v-for="(result,index) in results" :key="index">
            <h1 class="mt-5" v-if="result.mode == 0">Tick {{ result.tick }}</h1>
            <h1 class="mt-5" v-if="result.mode > 0">Vortick {{ result.mode }}</h1>
            <v-divider></v-divider>
            <gn-combat-result :result="result.response"></gn-combat-result>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import GnCombatResultOverview from '@/components/GnCombatResultOverview'
import GnCombatResult from '@/components/GnCombatResult'

export default {
    name: 'GnCombatResults',
    components: {
        GnCombatResultOverview,
        GnCombatResult,
    },
    props: {
        results: function () {
            return {
                type: Array,
                default: [],
            }
        }
    },
}
</script>