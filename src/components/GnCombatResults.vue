<template>
    <div v-show="results.length > 0">
        <h1 class="mt-5">Übersicht</h1>
        <gn-combat-result-overview :results="results" class="mb-5"></gn-combat-result-overview>
        <!-- <v-divider class="mt-5 mb-5"></v-divider> -->
        <div v-for="(result, index) in results" :key="index">
            <h3 v-if="(index > 0 && result.tick != results[index-1].tick) || index == 0">Tick {{ result.tick }}</h3>
            <v-divider v-if="(index > 0 && result.tick != results[index-1].tick) || index == 0"  class="mb-5"></v-divider>
            <gn-combat-result class="mb-5" :result="result.response" :tick="result.tick" :mode="result.mode"></gn-combat-result>
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
        },
    }
}
</script>