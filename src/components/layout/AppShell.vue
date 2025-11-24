<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-3">
          
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">AlienSoft</p>
            <p class="text-lg font-semibold text-slate-900">Product Manager</p>
          </div>
        </div>
        <div v-if="auth.isAuthenticated" class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-sm font-semibold text-slate-900">
              {{ auth.user?.firstName }} {{ auth.user?.lastName }}
            </p>
            <p class="text-xs text-slate-500">{{ auth.user?.username }}</p>
          </div>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand"
            @click="handleLogout"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>

