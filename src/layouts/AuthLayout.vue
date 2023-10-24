<script setup lang="ts">
import { defineComponent } from 'vue'

import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-app>
    <v-app-bar :order="order">
      <v-spacer></v-spacer>

      <v-btn
        v-if="theme.global.name.value === 'light'"
        @click="toggleTheme"
        variant="text"
        icon="mdi-weather-night"
      />
      <v-btn
        v-if="theme.global.name.value === 'dark'"
        @click="toggleTheme"
        variant="text"
        icon="mdi-weather-sunny"
      />

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
      <div class="pa-5 d-flex flex-column justify-center align-center" style="min-height: 95%">
        <div class="text-h5 mb-6">DEMO EUREKA</div>
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
  name: 'AuthLayout',
  data: () => ({
    order: 0
  })
})
</script>
