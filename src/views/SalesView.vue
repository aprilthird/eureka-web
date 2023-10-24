<script setup lang="ts">
import { es } from 'date-fns/locale'
import { useTheme } from 'vuetify'
const theme = useTheme()
</script>

<template>
  <div class="mb-2 font-weight-bold">Búsqueda</div>
  <v-sheet class="mb-5 pa-4 overflow-hidden">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="query"
            label="Producto o Cliente"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="pt-0">
      <v-row no-gutters class="d-flex justify-end overflow-hidden">
        <v-dialog width="500" v-model="createDialog">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="me-2" color="info" prepend-icon="mdi-plus" @click="reset">
              Nuevo
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-form v-model="form" @submit.prevent="create">
              <v-card title="Nueva Venta">
                <v-card-text>
                  <v-datepicker
                    v-model="saleDate"
                    input-class-name="py-4"
                    format="dd/MM/yyyy"
                    placeholder="Fecha de Venta"
                    :enable-time-picker="false"
                    :format-locale="es"
                    cancel-text="Cerrar"
                    select-text="Seleccionar"
                    :dark="theme.global.current.value.dark"
                    :rules="[required]"
                  ></v-datepicker>
                </v-card-text>
                <v-card-text>
                  <v-select
                    v-model="productId"
                    label="Producto"
                    :items="products"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :rules="[required]"
                  ></v-select>
                </v-card-text>
                <v-card-text>
                  <v-select
                    v-model="customerId"
                    label="Cliente"
                    :items="customers"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :rules="[required]"
                  ></v-select>
                </v-card-text>
                <v-card-text>
                  <v-text-field
                    v-model="quantity"
                    class="mt-4"
                    variant="outlined"
                    label="Cantidad"
                    :readonly="saving"
                    :rules="[required]"
                  ></v-text-field>
                </v-card-text>
                <v-card-text>
                  <strong>Total: S/ {{ subTotal }}</strong>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Cerrar" @click="isActive.value = false"></v-btn>
                  <v-btn
                    text="Guardar"
                    color="primary"
                    type="submit"
                    :disabled="!form"
                    :loading="saving"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </template>
        </v-dialog>
        <v-btn color="primary" @click="reload" prepend-icon="mdi-magnify"> Buscar </v-btn>
      </v-row>
    </v-container>
  </v-sheet>
  <div class="mb-2 font-weight-bold">Ventas</div>
  <v-sheet class="mb-5 pa-5 overflow-hidden">
    <div class="pa-6 d-flex align-center justify-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="sales.length === 0 && !loading">
      <div class="text-center">No se encontraron resultados.</div>
    </div>
    <div v-if="sales.length > 0 && !loading">
      <v-table>
        <thead>
          <tr>
            <th class="font-weight-bold">ID</th>
            <th class="font-weight-bold">Fecha</th>
            <th class="font-weight-bold">Producto</th>
            <th class="font-weight-bold">Cliente</th>
            <th class="font-weight-bold">Precio Unitario</th>
            <th class="font-weight-bold">Cantidad</th>
            <th class="font-weight-bold">Total</th>
            <th class="font-weight-bold"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sales" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.saleDate.toLocaleDateString() }}</td>
            <td>{{ item.product.name }}</td>
            <td>{{ item.customer.name }}</td>
            <td>S/ {{ item.unitPrice }}</td>
            <td>{{ item.quantity }}</td>
            <td>S/ {{ item.quantity * item.unitPrice }}</td>
            <td class="d-flex align-center justify-end">
              <v-btn class="me-2" color="warning" prepend-icon="mdi-pencil" @click="showEdit(item)">
                Editar
              </v-btn>
              <v-btn color="error" prepend-icon="mdi-delete" @click="showRemove(item)">
                Eliminar
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-pagination v-model="page" :length="totalPages" rounded="circle"></v-pagination>
    </div>
  </v-sheet>
  <v-dialog width="500" v-model="editDialog">
    <template v-slot:default="{ isActive }">
      <v-form v-model="form" @submit.prevent="edit">
        <v-card title="Editar Venta">
          <v-card-text>
            <v-datepicker
              v-model="saleDate"
              input-class-name="py-4"
              format="dd/MM/yyyy"
              placeholder="Fecha de Venta"
              :enable-time-picker="false"
              :format-locale="es"
              cancel-text="Cerrar"
              select-text="Seleccionar"
              :dark="theme.global.current.value.dark"
              :rules="[required]"
            ></v-datepicker>
          </v-card-text>
          <v-card-text>
            <v-select
              v-model="productId"
              label="Producto"
              :items="products"
              item-title="name"
              item-value="id"
              variant="outlined"
              :rules="[required]"
            ></v-select>
          </v-card-text>
          <v-card-text>
            <v-select
              v-model="customerId"
              label="Cliente"
              :items="customers"
              item-title="name"
              item-value="id"
              variant="outlined"
              :rules="[required]"
            ></v-select>
          </v-card-text>
          <v-card-text>
            <v-text-field
              v-model="quantity"
              class="mt-4"
              variant="outlined"
              label="Cantidad"
              :readonly="saving"
              :rules="[required]"
            ></v-text-field>
          </v-card-text>
          <v-card-text>
            <strong>Total: S/ {{ subTotal }}</strong>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Cerrar" @click="isActive.value = false"></v-btn>
            <v-btn
              text="Guardar"
              color="primary"
              type="submit"
              :disabled="!form"
              :loading="saving"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
  <v-dialog width="500" v-model="removeDialog">
    <template v-slot:default="{ isActive }">
      <v-card title="Desactivar Venta">
        <v-card-text> ¿Desea desactivar el registro? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cancelar" @click="isActive.value = false"></v-btn>
          <v-btn text="Confirmar" color="primary" :loading="saving" @click="remove"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000" outlined>
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script lang="ts">
import ApiUtils from '@/utils/api-utils'
import Sale from '@/models/sale'
import Customer from '@/models/customer'
import Product from '@/models/product'
import AuthResponse from '@/models/auth-response'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      query: '',
      loading: false,
      saving: false,
      error: false,
      form: false,
      sale: new Sale(),
      id: 0,
      saleDate: new Date(),
      quantity: 1,
      productId: 0,
      customerId: 0,
      subTotal: 0,
      snackbar: false,
      createDialog: false,
      editDialog: false,
      removeDialog: false,
      snackbarColor: 'primary',
      snackbarMessage: '',
      authResponse: new AuthResponse(),
      products: [] as Product[],
      customers: [] as Customer[],
      sales: [] as Sale[]
    }
  },
  watch: {
    query: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.fetchData()
        }
      },
      deep: true
    },
    page: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.fetchData()
        }
      },
      deep: true
    },
    productId: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue !== 0) {
            const product = this.products.find((x) => x.id === newValue)
            this.subTotal = product.price * this.quantity
          }
        }
      },
      deep: true
    },
    quantity: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          const product = this.products.find((x) => x.id === this.productId)
          this.subTotal = product.price * this.quantity
        }
      }
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      fetch(`${ApiUtils.salesUrl}?q=${this.query}`, {
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`
        }
      })
        .then((response) => {
          response.json().then((result) => {
            result.map((x) => {
              var dateParts = x.saleDate.split('-')
              console.log(dateParts)
              x.saleDate = new Date(+dateParts[0], parseInt(dateParts[1]) - 1, +dateParts[2])
            })
            this.sales = result
          })
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })

      fetch(`${ApiUtils.customersUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`
        }
      })
        .then((response) => {
          response.json().then((result) => {
            this.customers = result
          })
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })

      fetch(`${ApiUtils.productsUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`
        }
      })
        .then((response) => {
          response.json().then((result) => {
            this.products = result
          })
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    reload() {
      this.fetchData()
    },
    showMessage(type: string, message: string) {
      this.snackbar = true
      this.snackbarColor = type
      this.snackbarMessage = message
    },
    reset() {
      this.productId = this.products[0].id
      this.customerId = this.customers[0].id
      this.saleDate = new Date()
      this.quantity = 1
      this.id = 0
    },
    showEdit(item: Sale) {
      this.productId = item.product.id
      this.customerId = item.customer.id
      this.quantity = item.quantity
      this.saleDate = item.saleDate
      console.log(item.saleDate)
      this.id = item.id
      this.editDialog = true
    },
    showRemove(item: Sale) {
      this.id = item.id
      this.removeDialog = true
    },
    create() {
      if (!this.form) return

      this.saving = true
      let data = {
        productId: this.productId,
        customerId: this.customerId,
        quantity: this.quantity,
        saleDate: this.saleDate.toISOString().split('T')[0]
      }
      fetch(`${ApiUtils.salesUrl}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            this.createDialog = false
            this.reload()
            this.showMessage('success', 'Se creó el registro con éxito.')
          } else {
            this.showMessage('error', 'Ocurrió un error en el servidor.')
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
    edit() {
      if (!this.form) return

      this.saving = true
      let data = {
        productId: this.productId,
        customerId: this.customerId,
        quantity: this.quantity,
        saleDate: this.saleDate.toISOString().split('T')[0]
      }
      fetch(`${ApiUtils.salesUrl}/${this.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            this.editDialog = false
            this.reload()
            this.showMessage('success', 'Se guardaron los cambios con éxito.')
          } else {
            this.showMessage('error', 'Ocurrió un error en el servidor.')
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
    remove() {
      this.saving = true
      fetch(`${ApiUtils.salesUrl}/${this.id}`, {
        headers: {
          Authorization: `Bearer ${this.authResponse.accessToken}`
        },
        method: 'DELETE'
      })
        .then((response) => {
          if (response.ok) {
            this.removeDialog = false
            this.reload()
            this.showMessage('success', 'Se eliminó el registro con éxito.')
          } else {
            this.showMessage('error', 'Ocurrió un error en el servidor.')
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
    required(v: any) {
      return !!v || 'El campo es requerido'
    },
    length(v: any) {
      if (v?.length == 11 && /[0-9-]+/.test(v)) return true
      return 'El campo debe tener 11 dígitos como mínimo'
    }
  },
  mounted() {
    const user = localStorage.getItem('user')
    if (user) {
      this.authResponse = JSON.parse(user)
      this.user = this.authResponse.username
      this.fetchData()
    } else {
      this.router.push('/login')
    }
  }
}
</script>
