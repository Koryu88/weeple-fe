<script setup lang="ts">
import Sidebar from '@/components/navigation/Sidebar.vue'
import MobileTabBar from '@/components/navigation/MobileTabBar.vue'
</script>

<template>
  <div class="relative min-h-dvh border-zinc-800 text-slate-200 overflow-hidden">
    <Sidebar />
    <main class="relative mx-auto w-full max-w-screen-2xl p-4 md:pl-20 pb-16 md:pb-6">
      <slot />
    </main>
    <MobileTabBar />

    <!-- sfumatura -->
    <div
        class="z-0 pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-950/25"
    ></div>
  </div>
</template>
