<script setup lang="ts">
import Sidebar from '@/components/navigation/Sidebar.vue'
import MobileTabBar from '@/components/navigation/MobileTabBar.vue'
</script>

<template>
  <div class="min-h-dvh bg-zinc-950 text-slate-200">
    <Sidebar />
    <main class="relative mx-auto w-full max-w-screen-2xl p-4 md:pl-20 pb-16 md:pb-6">
      <slot />
    </main>
    <MobileTabBar />
  </div>
</template>
