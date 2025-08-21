<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-center text-white">
    <h1 class="text-[10rem] font-extrabold text-red-600 drop-shadow-lg select-none">404</h1>
    <p class="mt-4 text-2xl font-light text-zinc-300">
      {{ t('pages.notFound.subtitle') }}
    </p>

    <RouterLink
        to="/"
        class="mt-8 rounded-xl bg-red-600 px-6 py-3 text-lg font-semibold shadow-lg transition
             hover:bg-red-700 hover:shadow-red-700/40"
        :aria-label="t('pages.notFound.backHome')"
    >
      {{ t('pages.notFound.backHome') }}
    </RouterLink>
  </div>
</template>
