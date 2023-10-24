import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        layout: 'Auth'
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: 'Default'
      }
    },
    {
      path: '/clientes',
      name: 'customers',
      component: () => import('../views/CustomersView.vue'),
      meta: {
        layout: 'Default'
      }
    },
    {
      path: '/productos',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: {
        layout: 'Default'
      }
    },
    {
      path: '/ventas',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
      meta: {
        layout: 'Default'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
