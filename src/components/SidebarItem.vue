<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import IconMdi from './IconMdi.vue'

const props = defineProps<{
  iconPath: string
  label: string
  to?: string            // se presente usa <router-link>, altrimenti <button>
  activeMatch?: string   // regex/stringa per calcolare l’attivo (fallback = to)
  disabled?: boolean
}>()

const route = useRoute()

const isActive = computed(() => {
  if (!props.to) return false
  const pattern = props.activeMatch ?? props.to
  try {
    return new RegExp(pattern).test(route.path)
  } catch {
    return route.path.startsWith(props.to)
  }
})
</script>

<template>
  <component
      :is="props.to ? 'router-link' : 'button'"
      :to="props.to"
      :disabled="props.disabled"
      class="group mx-2 my-1 flex h-12 w-12 items-center justify-center rounded-2xl
           text-zinc-300 transition
           hover:bg-zinc-800 hover:text-white
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
           disabled:opacity-50 disabled:pointer-events-none"
      :class="isActive ? 'bg-zinc-800 text-white ring-1 ring-zinc-700' : ''"
      :title="props.label"
      :aria-label="props.label"
  >
    <IconMdi :path="props.iconPath" :size="24" :title="props.label" />
  </component>
</template>
