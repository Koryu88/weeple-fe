<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  title?: string
  iconPath: string
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'ghost' | 'outline'
  disabled?: boolean
}>(), {
  type: 'button',
  size: 'md',
  variant: 'primary',
})
</script>

<template>
  <button
      :type="props.type"
      class="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 font-medium shadow-sm transition active:scale-[.98] disabled:opacity-50"
      :class="{
      'text-white border-transparent bg-indigo-600 hover:bg-indigo-500': variant==='primary',
      'border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800': variant==='ghost',
      'border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800': variant==='outline',
      'text-sm px-2 py-1 rounded-xl': size==='sm',
      'text-base px-3 py-2 rounded-2xl': size==='md',
      'text-lg px-4 py-3 rounded-2xl': size==='lg',
    }"
      :title="title || label"
      :aria-label="title || label"
      :disabled="disabled"
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path :d="iconPath" fill="currentColor" />
    </svg>
    <span v-if="label">{{ label }}</span>
  </button>
</template>
