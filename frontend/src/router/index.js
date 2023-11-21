import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          component: () => import('@/views/auth/RegisterView.vue')
        }
      ]
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart/CartView.vue')
    },
    {
      path: '/products/:id',
      name: 'product',
      component: () => import('@/views/products/[id]/ProductView.vue')
    },
    {
      path: '/customer',
      name: 'customer',
      component: () => import('@/views/customer/CustomerView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      children: [
        {
          path: '',
          component: () => import('@/views/admin/AdminView.vue')
        },
        {
          path: 'customers',
          component: () => import('@/views/admin/customers/AdminCustomers.vue')
        },
        {
          path: 'customers/:id/delete',
          component: () => import('@/views/admin/customers/AdminDeleteCustomer.vue')
        },
        {
          path: 'customers/:id/edit',
          component: () => import('@/views/admin/customers/AdminEditCustomer.vue')
        },
        {
          path: 'products',
          component: () => import('@/views/admin/products/AdminProducts.vue')
        },
        {
          path: 'products/create',
          component: () => import('@/views/admin/products/AdminCreateProduct.vue')
        },
        {
          path: 'products/:id/edit',
          component: () => import('@/views/admin/products/AdminProductEdit.vue')
        },
        {
          path: 'invoices',
          component: () => import('@/views/admin/invoices/AdminInvoices.vue')
        },
        {
          path: 'invoices/:id',
          component: () => import('@/views/admin/invoices/AdminInvoiceDetail.vue')
        },
        {
          path: 'invoices/:id/delete',
          component: () => import('@/views/admin/invoices/AdminDeleteInvoice.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.path.startsWith('/admin')) {
    if (userStore.isAdmin()) {
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router
