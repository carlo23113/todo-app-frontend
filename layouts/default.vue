<template>
  <v-app dark>
    <v-app-bar
      color="primary"
      :clipped-left="clipped"
      fixed
      app
      dark
      dense
      elevation="0"
    >
      <div id="app-title">TO-DO APP</div>
      <v-spacer />
      <v-btn @click="logout()" text small
        >Logout<v-icon class="ml-2" small :loading="loading"
          >mdi-logout</v-icon
        ></v-btn
      >
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      loading: false,
    }
  },
  methods: {
    logout() {
      this.loading = true
      this.$eventBus.$emit('skipQuery')
      this.$store.commit('global/skipQuery', true)
      this.$apolloHelpers
        .onLogout()
        .then(() => {
          this.$router.push('/login')
          this.loading = false
        })
        .catch((err) => {
          console.error(err)
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
#app-title {
  font-weight: bold;
  color: white;
}
</style>
