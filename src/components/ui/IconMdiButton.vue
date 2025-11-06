<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(defineProps<{
  label?: string
  title?: string
  iconPath: string
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  disabled?: boolean
  to?: object | string
}>(), {
  type: 'button',
  size: 'md',
  variant: 'primary',
})

const componentTag = computed(() => (props.to ? RouterLink : 'button'))

const sizeClasses = computed(() => {
  return {
    'text-sm px-2 py-1 rounded-xl': props.size === 'sm',
    'text-base px-3 py-2 rounded-2xl': props.size === 'md',
    'text-lg px-4 py-3 rounded-2xl': props.size === 'lg',
  }
})

const variantClasses = computed(() => {
  return {
    'text-white border-transparent bg-indigo-600 hover:bg-indigo-500': props.variant === 'primary',
    'rounded-full p-2 text-zinc-100 bg-black/50 border border-white/10 backdrop-blur-sm hover:bg-black/70 focus-visible:outline-zinc-600': props.variant === 'secondary',
    'border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800': props.variant === 'ghost',
    'border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800': props.variant === 'outline',
  }
})
</script>

<template>
  <component
      :is="componentTag"
      :to="props.to"
      :class="[sizeClasses, variantClasses, 'inline-flex items-center gap-2 rounded-2xl border font-medium shadow-sm transition active:scale-[.98] disabled:opacity-50']"
      :title="props.title || props.label"
      :aria-label="props.title || props.label"
      :disabled="props.disabled"
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path :d="props.iconPath" fill="currentColor" />
    </svg>
    <span v-if="props.label" class="hidden sm:inline">{{ props.label }}</span>
  </component>
</template>
