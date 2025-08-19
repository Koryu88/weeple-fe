<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import PlainLayout from '@/components/layout/PlainLayout.vue'

const route = useRoute()
const useChrome = computed(() => route.meta?.chrome !== false)
</script>

<template>
  <component :is="useChrome ? AppShell : PlainLayout">
    <router-view />
  </component>
</template>
