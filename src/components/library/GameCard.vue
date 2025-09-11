<script setup lang="ts">
import type { Game } from '@/types/game'
import RatingStars from '@/components/ui/RatingStars.vue'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const { t } = useI18n()

const props = defineProps<{
  game: Game
  genreName?: string
}>()
</script>

<template>
  <article
      v-bind="$attrs"
      class="h-full flex rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 gap-3"
  >
    <!-- Cover -->
    <div class="flex-shrink-0">
      <img
          v-if="game.coverUrl"
          :src="game.coverUrl"
          :alt="game.name"
          loading="lazy"
          class="h-32 w-24 rounded-xl object-cover"
      />
      <div
          v-else
          class="h-32 w-24 rounded-xl bg-zinc-800/60"
          :aria-label="game.name"
      />
    </div>

    <!-- Right content -->
    <div class="flex flex-1 flex-col min-w-0">
      <!-- HEADER: titolo + badge preferito (wrap su mobile) -->
      <header class="mb-1 flex flex-wrap items-start gap-2">
        <h3 class="text-base font-semibold text-zinc-100 truncate min-w-0 grow">
          {{ game.name }}
          <RatingStars class="md:hidden" :model-value="game.rating" readonly size="sm" />
        </h3>

        <span
            v-if="game.favorite"
            class="shrink-0 rounded-md bg-pink-600/20 px-2 py-0.5 text-xs text-pink-300"
        >
          ★ {{ t('library.favorite') }}
        </span>
      </header>

      <div
          class="col-span-2 md:col-span-1 flex flex-wrap items-center gap-1 min-w-0 mb-2 hidden md:block"
      >
        <span class="mr-2">{{ t('library.rating') }}:</span>
        <span class="inline-block">
            <RatingStars :model-value="game.rating" readonly size="sm" />
          </span>
      </div>

      <!-- DETTAGLI: griglia a 2 col su mobile, 3 da md: -->
      <div
          class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-300 md:grid-cols-3"
      >
        <div class="min-w-0">{{ t('library.age') }}: {{ game.minAge }}+</div>

        <div class="min-w-0">
          {{ t('library.players') }}: {{ game.playersMin }}–{{ game.playersMax }}
        </div>

        <div class="min-w-0">
          {{ t('library.difficulty') }}:
          {{ t('library.difficulties.' + game.difficulty) }}
        </div>

        <div class="min-w-0">
          {{ t('library.duration') }}: {{ game.durationMins }}
        </div>

        <!-- RATING: span piena riga su mobile per evitare sovrapposizioni -->


        <div class="min-w-0">
          {{ t('library.genre') }}: {{ genreName || '—' }}
        </div>

        <div class="min-w-0">
          {{ t('library.mode') }}:
          <span v-if="game.isCoop">{{ t('library.coop') }}</span>
          <span v-else-if="game.isCompetitive">{{ t('library.competitive') }}</span>
          <span v-else>—</span>
        </div>

        <div class="min-w-0">
          {{ t('library.oneShot') }}:
          {{ game.isOneShot ? t('common.yes') : t('common.no') }}
        </div>

        <div class="min-w-0">
          {{ t('library.lastPlayed') }}:
          {{ game.lastPlayedAt ? new Date(game.lastPlayedAt).toLocaleDateString() : '—' }}
        </div>
      </div>

      <!-- Footer (bottoni/azioni se servono) -->
      <footer class="mt-auto pt-2"></footer>
    </div>
  </article>
</template>
