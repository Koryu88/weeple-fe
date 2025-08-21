<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number // 0..5
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), { modelValue: 0, readonly: false, size: 'md' })

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const stars = computed(() => [1,2,3,4,5])

function set(v: number) {
  if (props.readonly) return
  emit('update:modelValue', v)
}
</script>

<template>
  <div class="inline-flex items-center gap-1 select-none">
    <button v-for="s in stars" :key="s" type="button"
            class="p-0.5"
            :class="{
        'text-yellow-400': s <= (modelValue||0),
        'text-zinc-500': s > (modelValue||0),
      }"
            @click="set(s)"
            :aria-label="`star-`+s"
    >
      <svg
          :class="{
          'h-4 w-4': size==='sm',
          'h-5 w-5': size==='md',
          'h-6 w-6': size==='lg',
        }"
          viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    </button>
  </div>
</template>
