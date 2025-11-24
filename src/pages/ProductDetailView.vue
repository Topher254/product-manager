<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '../components/layout/AppShell.vue'
import { useProductsStore } from '../stores/products'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const productId = Number(route.params.id)
const FALLBACK_IMAGE = 'https://dummyimage.com/600x600/edeff5/000080&text=PM'
const isDeleting = ref(false)
const loadError = ref('')

const product = computed(() => {
  return productsStore.selected?.id === productId
    ? productsStore.selected
    : productsStore.items.find((item) => item.id === productId)
})

const loadProduct = async () => {
  if (product.value) return
  try {
    await productsStore.fetchProductById(productId)
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Unable to load product'
  }
}

const handleDelete = async () => {
  if (isDeleting.value) return
  const confirmDelete = window.confirm('Delete this product from the catalogue?')
  if (!confirmDelete) return

  try {
    isDeleting.value = true
    await productsStore.deleteProduct(productId)
    router.push('/products')
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Unable to delete product'
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <AppShell>
    <section class="rounded-3xl bg-white shadow-lg shadow-slate-200/40">
      <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-brand">Product Detail</p>
          <h1 class="mt-2 text-3xl font-semibold text-slate-900">
            {{ product?.title ?? 'Loading product...' }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">Review inventory, pricing, and stock signals in one place.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"
            @click="router.back()"
          >
            ← Back
          </button>
          <button
            type="button"
            class="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

      <div v-if="productsStore.isLoading && !product" class="px-6 py-16 text-center text-slate-500">
        Loading product details...
      </div>

      <div v-else-if="loadError" class="px-6 py-16 text-center text-red-500">
        {{ loadError }}
      </div>

      <div v-else-if="product" class="grid gap-10 px-6 py-10 lg:grid-cols-[340px,1fr]">
        <div class="rounded-3xl border border-slate-100 bg-slate-50 p-6">
          <img
            :src="product.thumbnail || FALLBACK_IMAGE"
            :alt="product.title"
            class="h-64 w-full rounded-2xl object-cover shadow-inner"
          />
          <dl class="mt-6 space-y-4 text-sm text-slate-600">
            <div class="flex justify-between">
              <dt class="text-slate-500">Category</dt>
              <dd class="font-semibold capitalize text-slate-900">{{ product.category }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-slate-500">Price</dt>
              <dd class="font-semibold text-slate-900">${{ product.price.toFixed(2) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-slate-500">Stock</dt>
              <dd
                class="font-semibold"
                :class="product.stock > 50 ? 'text-emerald-600' : 'text-amber-600'"
              >
                {{ product.stock }} units
              </dd>
            </div>
            <div v-if="product.rating" class="flex justify-between">
              <dt class="text-slate-500">Rating</dt>
              <dd class="font-semibold text-slate-900">{{ product.rating.toFixed(1) }}/5</dd>
            </div>
            <div v-if="product.discountPercentage" class="flex justify-between">
              <dt class="text-slate-500">Discount</dt>
              <dd class="font-semibold text-slate-900">{{ product.discountPercentage }}%</dd>
            </div>
          </dl>
        </div>
        <div class="rounded-3xl border border-slate-100 p-8">
          <h2 class="text-2xl font-semibold text-slate-900">Description</h2>
          <p class="mt-4 text-base leading-relaxed text-slate-600">
            {{ product.description }}
          </p>
          <div v-if="product.images?.length" class="mt-10">
            <p class="text-sm font-semibold text-slate-500">Gallery</p>
            <div class="mt-4 grid gap-4 md:grid-cols-3">
              <img
                v-for="image in product.images"
                :key="image"
                :src="image"
                class="h-32 w-full rounded-2xl object-cover ring-1 ring-slate-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppShell>
</template>

