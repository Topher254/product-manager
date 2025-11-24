import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/LoginView.vue'
import ProductListView from '../pages/ProductListView.vue'
import ProductDetailView from '../pages/ProductDetailView.vue'
import ProductCreateView from '../pages/ProductCreateView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/products' },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductListView,
    },
    {
      path: '/products/new',
      name: 'product-new',
      component: ProductCreateView,
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/products' },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) {
    if (auth.isAuthenticated && to.name === 'login') {
      next({ name: 'products' })
      return
    }
    next()
    return
  }

  if (!auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router

