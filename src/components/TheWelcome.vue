<script setup lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import AuthResponse from '@/models/auth-response'
</script>

<template>
  <div>
    Bienvenido, usuario <strong>{{ user }}</strong> (ID: {{ id }})
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DefaultLayout',
  data: () => ({
    router: useRouter(),
    order: 0,
    drawer: true,
    id: 0,
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
      this.id = this.authResponse.id
    } else {
      this.router.push('/login')
    }
  }
})
</script>
