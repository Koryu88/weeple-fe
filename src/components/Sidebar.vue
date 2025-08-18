<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import {mdiChartLine, mdiDiceD20, mdiLibraryShelves,} from '@mdi/js'
import logoUrl from '@/assets/logo.png'

const props = defineProps<{
  logoImgSrc?: string
  logoLabel?: string
  logoText?: string
}>()
</script>

<template>
  <!-- Barra laterale sinistra, dark -->
  <aside
      role="navigation"
      aria-label="Barra laterale"
      class="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center
           gap-2 border-r border-zinc-800 bg-zinc-900/95 backdrop-blur
           text-slate-200"
  >
    <div
        class="flex h-12 w-12 my-3 items-center justify-center rounded-2xl
           bg-zinc-800 text-white"
        :title="props.logoLabel ?? 'Weeple!'"
        aria-label="Logo"
    >
      <img
          :src="props.logoImgSrc ?? logoUrl"
      alt="Logo"
      class="h-7 w-7 object-contain"
      draggable="false"
      />
    </div>

    <div class="mx-auto h-px w-10 bg-zinc-800" />

    <!-- 2) LIBRERIA -->
    <SidebarItem
        :iconPath="mdiLibraryShelves"
        label="Libreria"
        to="/libreria"
        activeMatch="^/libreria"
    />

    <!-- 3) STATISTICHE -->
    <SidebarItem
        :iconPath="mdiChartLine"
        label="Statistiche"
        to="/statistiche"
        activeMatch="^/statistiche"
    />

    <!-- 4) UTILITÀ -->
    <SidebarItem
        :iconPath="mdiDiceD20"
        label="Utilità"
        to="/utilita"
        activeMatch="^/utilita"
    />

    <div class="flex-1" />

    <!-- (opzionale) footer -->
    <div class="mb-3 text-[10px] text-slate-500 select-none">v1.0</div>
  </aside>
</template>
