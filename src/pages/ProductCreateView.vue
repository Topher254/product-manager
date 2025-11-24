<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/layout/AppShell.vue'
import { useProductsStore } from '../stores/products'

const router = useRouter()
const productsStore = useProductsStore()

const form = reactive({
  title: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  thumbnail: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const validate = () => {
  if (!form.title || !form.category) {
    errorMessage.value = 'Title and category are required.'
    return false
  }
  if (form.price <= 0) {
    errorMessage.value = 'Price must be greater than 0.'
    return false
  }
  if (form.stock < 0) {
    errorMessage.value = 'Stock cannot be negative.'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''

  if (!validate()) return

  try {
    isSubmitting.value = true
    const product = await productsStore.addProduct(form)
    router.push(`/products/${product.id}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to add product'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppShell>
    <section class="rounded-3xl bg-white px-6 py-8 shadow-lg shadow-slate-200/40">
      <header class="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-brand">Create</p>
          <h1 class="mt-2 text-3xl font-semibold text-slate-900">Add Product</h1>
          <p class="mt-1 text-sm text-slate-500">
            Capture the essentials—title, pricing, stock, and visuals—for a richer catalogue.
          </p>
        </div>
        <button
          type="button"
          class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"
          @click="router.push('/products')"
        >
          ← Back to list
        </button>
      </header>

      <form class="mt-8 grid gap-6 md:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="flex flex-col text-sm font-semibold text-slate-700">
          Title *
          <input
            v-model.trim="form.title"
            type="text"
            required
            placeholder="Product title"
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <label class="flex flex-col text-sm font-semibold text-slate-700">
          Category *
          <input
            v-model.trim="form.category"
            type="text"
            required
            placeholder="e.g. beauty"
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <label class="flex flex-col text-sm font-semibold text-slate-700">
          Price (USD) *
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <label class="flex flex-col text-sm font-semibold text-slate-700">
          Stock *
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            required
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <label class="md:col-span-2 flex flex-col text-sm font-semibold text-slate-700">
          Thumbnail URL
          <input
            v-model.trim="form.thumbnail"
            type="url"
            placeholder="https://cdn.dummyjson.com/product-images/..."
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <label class="md:col-span-2 flex flex-col text-sm font-semibold text-slate-700">
          Description
          <textarea
            v-model.trim="form.description"
            rows="4"
            placeholder="Add a concise but descriptive summary"
            class="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
          />
        </label>

        <div class="md:col-span-2 space-y-4">
          <p v-if="errorMessage" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            class="w-full rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/50 md:w-auto"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Create product' }}
          </button>
        </div>
      </form>
    </section>
  </AppShell>
</template>

