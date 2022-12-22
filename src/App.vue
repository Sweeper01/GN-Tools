<template>
    <v-app>
        <v-navigation-drawer app>
            <v-list dense nav>
                <v-list-item v-for="item in items" :key="item.title" link :to="item.route">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-switch v-model="$vuetify.theme.dark" @change="darkModeToggle" label="Darkmode"></v-switch>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    components: {},
    data: () => ({
        items: [
            { title: 'Simulator', icon: 'mdi-sword-cross', route: '/' },
            { title: 'Scan Auswertung', icon: 'mdi-magnify', route: '/ScanAuswertung' },
        ],
    }),
    methods: {
        darkModeToggle: function (elem) {
            localStorage.setItem('gn-simu-darkmode', elem)
        },
    },
    created: function () {
        let darkMode = localStorage.getItem('gn-simu-darkmode')
        this.$vuetify.theme.dark = (darkMode === 'true')
    },
}
</script>
<style>
</style>