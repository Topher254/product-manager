<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppShell from '../components/layout/AppShell.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()
const FALLBACK_IMAGE = 'https://dummyimage.com/200x200/edeff5/000080&text=PM'

onMounted(() => {
  if (!productsStore.items.length) {
    productsStore.fetchProducts()
  }
})

const products = computed(() => productsStore.filteredProducts)
</script>

<template>
  <AppShell>
    <section class="rounded-3xl bg-white px-6 py-6 shadow-lg shadow-slate-200/40">
      <header class="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-brand">Dashboard</p>
          <h1 class="mt-2 text-3xl font-semibold text-slate-900">Product Catalogue</h1>
          <p class="mt-1 text-sm text-slate-500">Search, filter, and manage items from DummyJSON in real time.</p>
        </div>
        <RouterLink
          to="/products/new"
          class="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand/90"
        >
          + Add New Product
        </RouterLink>
      </header>

      <div class="mt-6 grid gap-4 md:grid-cols-[1fr,220px]">
        <label class="flex flex-col text-sm font-medium text-slate-700">
          Search
          <input
            v-model="productsStore.searchTerm"
            type="search"
            placeholder="Search by title or description"
            class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>
        <label class="flex flex-col text-sm font-medium text-slate-700">
          Category
          <select
            v-model="productsStore.categoryFilter"
            class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          >
            <option v-for="category in productsStore.categories" :key="category" :value="category">
              {{ category === 'all' ? 'All categories' : category }}
            </option>
          </select>
        </label>
      </div>

      <div class="mt-8 overflow-hidden rounded-3xl border border-slate-100">
        <table class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4 font-semibold">Product</th>
              <th class="px-6 py-4 font-semibold">Category</th>
              <th class="px-6 py-4 font-semibold">Price</th>
              <th class="px-6 py-4 font-semibold">Stock</th>
              <th class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white text-sm text-slate-600">
            <tr v-if="productsStore.isLoading">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Loading products...</td>
            </tr>
            <tr v-else-if="productsStore.error">
              <td colspan="5" class="px-6 py-10 text-center text-red-500">
                {{ productsStore.error }}
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">No products match your filters.</td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="transition hover:bg-slate-50">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <img
                    :src="product.thumbnail || FALLBACK_IMAGE"
                    :alt="product.title"
                    class="h-12 w-12 rounded-full border border-slate-100 object-cover"
                  />
                  <div>
                    <p class="font-semibold text-slate-900">{{ product.title }}</p>
                    <p class="max-w-md text-xs text-slate-500">
                      {{ product.description }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 capitalize">{{ product.category }}</td>
              <td class="px-6 py-5 font-semibold text-slate-900">${{ product.price.toFixed(2) }}</td>
              <td class="px-6 py-5">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="product.stock > 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                >
                  {{ product.stock }} in stock
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <RouterLink
                  :to="`/products/${product.id}`"
                  class="text-sm font-semibold text-brand hover:text-brand/80"
                >
                  View details →
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AppShell>
</template>

