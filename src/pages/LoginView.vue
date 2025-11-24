<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  username: 'emilys',
  password: 'emilyspass',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await auth.login(form)
    const redirectParam = route.query.redirect
    const redirectPath = typeof redirectParam === 'string' ? redirectParam : '/products'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to login'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 md:grid-cols-2">
    <section class="hidden min-h-screen flex-col bg-brand px-12 py-16 text-white md:flex">
      <p class="text-sm uppercase tracking-[0.4em] text-white/70">AlienSoft</p>
      <h1 class="mt-6 text-4xl font-semibold leading-tight">Product Management Suite</h1>
      <p class="mt-4 text-sm text-white/90">
        Stay in control of your catalog with detailed inventory views, smart filters, and confident collaboration.
      </p>
     
      <div class="mt-auto rounded-2xl border border-white/30 bg-white/10 p-6 text-sm text-white/90">
        <p class="font-semibold">Sample Credentials</p>
        <p class="mt-1">Username: <span class="font-mono">emilys</span></p>
        <p>Password: <span class="font-mono">emilyspass</span></p>
      </div>
    </section>
    <section class="flex items-center justify-center bg-slate-50 px-6 py-12">
      <div class="w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-2xl shadow-brand/10">
        <p class="text-xs uppercase tracking-[0.4em] text-brand">Login</p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900">Welcome back</h2>
        <p class="mt-2 text-sm text-slate-500">Please log in to continue to the product workspace.</p>
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <label class="block text-sm font-medium text-slate-700">
            Username
            <input
              v-model.trim="form.username"
              type="text"
              required
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4"
              placeholder="Enter your username"
            />
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Password
            <div class="relative mt-2">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none ring-brand/10 focus:border-brand focus:ring-4 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </label>
          <p class="text-xs text-slate-500">
            Use the provided sample credentials on the left to log in.
          </p>
          <p v-if="errorMessage" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            class="w-full rounded-2xl bg-brand px-4 py-3 text-base font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/50"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Authenticating...' : 'Login' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>