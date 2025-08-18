<script setup lang="ts">
const props = defineProps<{
  path: string
  size?: number
  title?: string
}>()
</script>

<template>
  <svg
      :width="props.size ?? 24"
      :height="props.size ?? 24"
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      :aria-label="props.title"
      :title="props.title"
  >
    <path :d="props.path" />
  </svg>
</template>
