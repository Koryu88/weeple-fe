<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
const props = withDefaults(defineProps<{
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})
const id = `switch-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <label :for="id" class="flex items-start gap-3 select-none">
    <button
        :id="id"
        type="button"
        role="switch"
        :aria-checked="model ? 'true' : 'false'"
        :disabled="disabled"
        @click="!disabled && (model = !model)"
        class="relative inline-flex shrink-0 items-center transition-all"
        :class="[
        size === 'sm' ? 'h-6 w-10' : 'h-7 w-12',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        model ? 'bg-indigo-600' : 'bg-zinc-700',
        'rounded-full'
      ]"
    >
      <span
          class="absolute left-0 top-0 bottom-0 my-auto inline-block rounded-full bg-white transition-all"
          :class="[
          size === 'sm'
            ? (model ? 'translate-x-5 h-5 w-5' : 'translate-x-1 h-5 w-5')
            : (model ? 'translate-x-6 h-6 w-6' : 'translate-x-1.5 h-6 w-6')
        ]"
      />
      <span class="sr-only">{{ label }}</span>
    </button>

    <span class="flex flex-col">
      <span v-if="label" class="text-sm text-zinc-100">{{ label }}</span>
      <span v-if="description" class="text-xs text-zinc-400">{{ description }}</span>
    </span>
  </label>
</template>
