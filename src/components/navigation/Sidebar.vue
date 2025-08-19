<script setup lang="ts">
import SidebarItem from '@/components/SidebarItem.vue'
import logoUrl from '@/assets/logo.png'
import { MENU_ITEMS } from '@/navigation/menu'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  logoImgSrc?: string
  logoLabel?: string
  logoText?: string
}>()
</script>

<template>
  <aside
      role="navigation"
      aria-label="Barra laterale"
      class="hidden md:flex fixed left-0 top-0 z-40 h-screen w-16 flex-col items-center
         gap-2 border-r border-zinc-800 bg-zinc-900/95 backdrop-blur text-slate-200"
  >

    <div
        class="flex h-12 w-12 my-3 items-center justify-center rounded-2xl
             bg-zinc-800 text-white"
        :title="props.logoLabel ?? 'Weeple!'"
        aria-label="Logo"
    >
      <img :src="props.logoImgSrc ?? logoUrl" alt="Logo" class="h-7 w-7 object-contain" draggable="false" />
    </div>

    <div class="mx-auto h-px w-10 bg-zinc-800" />

    <SidebarItem
        v-for="item in MENU_ITEMS"
        :key="item.to"
        :iconPath="item.iconPath"
        :label="t(item.labelKey)"
        :to="item.to"
        :activeMatch="item.activeMatch"
    />

    <div class="flex-1" />
    <div class="mb-3 text-[10px] text-slate-500 select-none">v1.0</div>
  </aside>
</template>
