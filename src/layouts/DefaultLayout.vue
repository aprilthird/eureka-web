<script setup lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import AuthResponse from '@/models/auth-response'

import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="primary" permanent>
      <v-list class="pa-0 d-flex flex-column align-center justify-center">
        <!-- <v-list-item
          title="Monitor Costo por Carpetas"
          subtitle="Oechsle"
          style="min-height: 4rem"
        /> -->
        <div class="text-h6 my-6 mx-4 text-center">{{ user }}</div>
      </v-list>
      <v-divider />
      <v-list nav class="pa-0">
        <v-list-item link class="pa-5 mb-0" prepend-icon="mdi-home" to="/">
          <div>Inicio</div>
        </v-list-item>
        <v-list-item link class="pa-5 mb-0" prepend-icon="mdi-account-tie" to="/clientes">
          <div>Clientes</div>
        </v-list-item>
        <v-list-item link class="pa-5 mb-0" prepend-icon="mdi-tag" to="/productos">
          <div>Productos</div>
        </v-list-item>
        <v-list-item link class="pa-5 mb-0" prepend-icon="mdi-file-document" to="/ventas">
          <div>Ventas</div>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list nav class="pa-0">
          <v-list-item class="pa-5" link prepend-icon="mdi-logout" @click="logout">
            <div>Cerrar sesión</div>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar :order="order">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Demo Eureka</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn variant="text" icon="mdi-magnify"></v-btn>

      <v-btn
        v-if="theme.global.name.value === 'dark'"
        @click="toggleTheme"
        variant="text"
        icon="mdi-weather-night"
      />
      <v-btn
        v-if="theme.global.name.value === 'light'"
        @click="toggleTheme"
        variant="text"
        icon="mdi-weather-sunny"
      />

      <v-btn variant="text" icon="mdi-bell-outline"></v-btn>

      <!-- <v-switch
        v-model="order"
        hide-details
        inset
        label="Toggle order"
        true-value="-1"
        false-value="0"
      ></v-switch> -->
    </v-app-bar>

    <v-main :class="theme.global.name.value === 'dark' ? '' : 'bg-grey-lighten-4'">
      <div class="pa-5" style="min-height: 95%">
        <slot></slot>
      </div>
      <v-footer class="d-flex align-center justify-center text-center w-100" style="min-height: 5%">
        {{ new Date().getFullYear() }} —
        <strong class="ml-1">Eureka</strong>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DefaultLayout',
  data: () => ({
    router: useRouter(),
    order: 0,
    drawer: true,
    user: 'Usuario',
    authResponse: new AuthResponse()
  }),
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.router.push('/login')
    }
  },
  mounted() {
    const user = localStorage.getItem('user')
    if (user) {
      this.authResponse = JSON.parse(user)
      this.user = this.authResponse.username
    } else {
      this.router.push('/login')
    }
  }
})
</script>
