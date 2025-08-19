<script setup lang="ts">
import { MENU_ITEMS } from '@/navigation/menu'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import logoUrl from '@/assets/logo.png'

const route = useRoute()
const { t } = useI18n()

function isActive(match: string): boolean {
  try { return new RegExp(match).test(route.path) }
  catch { return route.path === match || route.path.startsWith(match) }
}
</script>

<template>
  <nav
      role="navigation"
      aria-label="Barra inferiore"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur md:hidden"
      :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
  >
    <ul class="mx-auto flex max-w-screen-md items-stretch justify-around">
      <!-- Voci di menu: solo icone -->
      <li v-for="item in MENU_ITEMS" :key="item.to" class="flex-1">
        <RouterLink
            :to="item.to"
            class="group flex h-14 flex-col items-center justify-center"
            :aria-label="t(item.labelKey)"
            :title="t(item.labelKey)"
            :aria-current="isActive(item.activeMatch) ? 'page' : undefined"
        >
          <svg class="h-6 w-6 transition-transform group-active:translate-y-px text-white"
               viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path :d="item.iconPath" />
          </svg>
          <!-- indicatore attivo -->
          <span v-if="isActive(item.activeMatch)" class="mt-1 h-0.5 w-6 rounded bg-white/90" />
        </RouterLink>
      </li>

      <!-- Logo finale non cliccabile -->
      <li class="flex-0 px-2">
        <div class="flex h-14 items-center justify-center">
          <div class="flex h-9 w-9 items-center justify-center text-white select-none" aria-hidden="true">
            <img :src="logoUrl" alt="Logo" class="h-6 w-6 object-contain" draggable="false" />
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav { box-sizing: content-box; }
</style>
