import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'
import { useAuthStore } from './auth'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    isLoading: false,
    error: null,
    selected: null,
    searchTerm: '',
    categoryFilter: 'all',
  }),
  getters: {
    categories: (state) => {
      const unique = new Set(state.items.map((item) => item.category))
      return ['all', ...Array.from(unique)]
    },
    filteredProducts(state) {
      return state.items.filter((product) => {
        const matchesSearch =
          !state.searchTerm ||
          product.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchTerm.toLowerCase())
        const matchesCategory = state.categoryFilter === 'all' || product.category === state.categoryFilter
        return matchesSearch && matchesCategory
      })
    },
  },
  actions: {
    setSearchTerm(term) {
      this.searchTerm = term
    },
    setCategoryFilter(category) {
      this.categoryFilter = category
    },
    async fetchProducts() {
      this.isLoading = true
      this.error = null

      try {
        const { products } = await apiRequest('/products?limit=100&select=title,description,category,price,stock,thumbnail,rating,discountPercentage')
        this.items = products
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load products'
      } finally {
        this.isLoading = false
      }
    },
    async fetchProductById(id) {
      const existing = this.items.find((product) => product.id === id)
      if (existing) {
        this.selected = existing
        return existing
      }

      this.isLoading = true
      this.error = null

      try {
        const product = await apiRequest(`/products/${id}`)
        this.selected = product
        return product
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load product'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async addProduct(payload) {
      const auth = useAuthStore()
      const product = await apiRequest('/products/add', {
        method: 'POST',
        body: payload,
        token: auth.token,
      })
      this.items = [product, ...this.items]
      return product
    },
    async deleteProduct(id) {
      const auth = useAuthStore()
      await apiRequest(`/products/${id}`, {
        method: 'DELETE',
        token: auth.token,
      })
      this.items = this.items.filter((product) => product.id !== id)
      if (this.selected?.id === id) {
        this.selected = null
      }
    },
  },
})

