<script setup lang="ts">
import ApiUtils from '@/utils/api-utils'
import AuthResponse from '@/models/auth-response'
import { useRouter } from 'vue-router'
</script>

<template>
  <v-sheet width="300" class="mx-auto pa-6">
    <v-form v-model="form" @submit.prevent="login">
      <v-text-field v-model="username" :rules="[required]" label="Usuario"></v-text-field>

      <v-text-field
        class="mt-4"
        v-model="password"
        :rules="[required]"
        type="password"
        label="ContraseñaAAA"
      ></v-text-field>

      <v-btn color="primary" class="mt-4" block type="submit" :disabled="!form" :loading="saving">
        Ingresar
      </v-btn>
    </v-form>
  </v-sheet>
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000" outlined>
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script lang="ts">
export default {
  data() {
    return {
      router: useRouter(),
      saving: false,
      error: false,
      form: false,
      username: '',
      password: '',
      authResponse: new AuthResponse(),
      snackbar: false,
      snackbarColor: 'primary',
      snackbarMessage: ''
    }
  },
  methods: {
    login() {
      if (!this.form) return

      this.saving = true

      let data = {
        username: this.username,
        password: this.password
      }
      console.log(ApiUtils.authUrl)
      fetch(`${ApiUtils.authUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((result) => {
              this.authResponse = result
              localStorage.setItem('user', JSON.stringify(this.authResponse))
              this.router.push('/')
            })
          }
        })
        .catch((err) => {
          console.error(err)
          this.showMessage('error', 'Ocurrió un error en el servidor.')
        })
        .finally(() => {
          this.saving = false
        })
    },
    showMessage(type: string, message: string) {
      this.snackbar = true
      this.snackbarColor = type
      this.snackbarMessage = message
    },
    required(v: any) {
      return !!v || 'El campo es requerido'
    }
  }
}
</script>
