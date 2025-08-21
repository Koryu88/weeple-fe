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
    <div class="flex flex-1 flex-col">
      <header class="mb-1 flex items-start justify-between gap-2">
        <h3 class="text-base font-semibold text-zinc-100 truncate">{{ game.name }}</h3>
        <span
            v-if="game.favorite"
            class="shrink-0 rounded-md bg-pink-600/20 px-2 py-0.5 text-xs text-pink-300"
        >
          ★ {{ t('library.favorite') }}
        </span>
      </header>

      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-300 md:grid-cols-3">
        <div>{{ t('library.age') }}: {{ game.minAge }}+</div>
        <div>{{ t('library.players') }}: {{ game.playersMin }}–{{ game.playersMax }}</div>
        <div>
          {{ t('library.difficulty') }}:
          {{ t('library.difficulties.' + game.difficulty) }}
        </div>

        <!-- DURATA (sopra rating) -->
        <div>
          {{ t('library.duration') }}: {{ game.durationMins }} {{ t('library.min') }}
        </div>

        <!-- RATING -->
        <div class="flex items-center gap-1">
          {{ t('library.rating') }}:
          <RatingStars :model-value="game.rating" readonly size="sm" />
        </div>

        <div>{{ t('library.genre') }}: {{ genreName || '—' }}</div>

        <div>
          {{ t('library.mode') }}:
          <span v-if="game.isCoop">{{ t('library.coop') }}</span>
          <span v-else-if="game.isCompetitive">{{ t('library.competitive') }}</span>
          <span v-else>—</span>
        </div>

        <div>
          {{ t('library.oneShot') }}:
          {{ game.isOneShot ? t('common.yes') : t('common.no') }}
        </div>

        <div>
          {{ t('library.lastPlayed') }}:
          {{ game.lastPlayedAt ? new Date(game.lastPlayedAt).toLocaleDateString() : '—' }}
        </div>
      </div>

      <!-- Footer (bottoni/azioni se servono) -->
      <footer class="mt-auto pt-2"></footer>
    </div>
  </article>
</template>