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
    })
}
</script>
<style>
</style>