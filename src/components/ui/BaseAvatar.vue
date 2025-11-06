<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seed: string;
  type: 'pixel-art' | 'identicon' | 'bottts-neutral' ;
  size?: number;
}>()

const avatarApiBase = import.meta.env.VITE_DICEBEAR_API_BASE_URL

const avatarUrl = computed(() => {
  if (!avatarApiBase) {
    console.error('VITE_DICEBEAR_API_BASE_URL is not set in .env file')
    return ''
  }
  return `${avatarApiBase}/${props.type}/svg?seed=${encodeURIComponent(props.seed)}`
})
</script>

<template>
  <img :src="avatarUrl" :alt="seed" class="object-cover bg-zinc-700">
</template>

