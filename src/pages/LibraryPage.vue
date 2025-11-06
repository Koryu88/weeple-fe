<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mdiPlus, mdiFilter, mdiChevronDown, mdiChevronUp } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import GameCard from '@/components/library/GameCard.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import { useGamesStore } from '@/stores/games'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const store = useGamesStore()
const { t } = useI18n()
const router = useRouter()
const showFilters = ref(false)

onMounted(() => {
  if (!store.games.length) store.fetchGames()
})

/** Toolbar/results text */
const resultsText = computed(() => {
  const c = filtered.value.length
  const key = c === 0 ? 'library.results.zero'
      : c === 1 ? 'library.results.one'
          : 'library.results.other'
  return t(key, { count: c })
})

/** Filters model */
const q = ref('') // search by name (full-row)
const favoriteOnly = ref(false)                     // switch
const onlyOneShot = ref(false)                      // switch (true → only one-shot)
const playersMax = ref<number | null>(null)         // only max players
const difficulty = ref<'any' | 'easy' | 'medium' | 'hard'>('any')
const minRating = ref(0)
const durationMax = ref<number | null>(null)        // only max duration (mins)
const genreId = ref<string | 'any'>('any')
const mode = ref<'any' | 'coop' | 'competitive'>('any')

// Age: derive ONLY from games; selectable multi-pills
const agesSelected = ref<number[]>([])
const availableAges = computed<number[]>(() => {
  const set = new Set<number>()
  for (const g of store.games) {
    if (typeof g.minAge === 'number') set.add(g.minAge)
  }
  return Array.from(set).sort((a, b) => a - b)
})
function toggleAge(a: number) {
  if (agesSelected.value.includes(a)) {
    agesSelected.value = agesSelected.value.filter(x => x !== a)
  } else {
    agesSelected.value.push(a)
  }
}

function clearAll() {
  q.value = ''
  favoriteOnly.value = false
  onlyOneShot.value = false
  playersMax.value = null
  difficulty.value = 'any'
  minRating.value = 0
  durationMax.value = null
  genreId.value = 'any'
  mode.value = 'any'
  agesSelected.value = []
}

const filtered = computed(() => {
  return store.games.filter(g => {
    if (favoriteOnly.value && !g.favorite) return false

    if (q.value && !g.name.toLowerCase().includes(q.value.toLowerCase())) return false

    if (agesSelected.value.length && !agesSelected.value.includes(g.minAge)) return false

    if (playersMax.value != null && g.playersMin > playersMax.value) return false

    if (difficulty.value !== 'any' && g.difficulty !== difficulty.value) return false
    if (minRating.value && g.rating < minRating.value) return false

    if (durationMax.value != null && g.durationMins > durationMax.value) return false

    if (genreId.value !== 'any' && g.genreId !== genreId.value) return false

    if (onlyOneShot.value && !g.isOneShot) return false

    if (mode.value !== 'any') {
      if (mode.value === 'coop' && !g.isCoop) return false
      if (mode.value === 'competitive' && !g.isCompetitive) return false
    }

    return true
  })
})

function onCreate() {
  router.push({ name: 'game-new' });
}

function genreNameById(id?: string) {
  return store.genres.find(g => g.id === id)?.name || '-'
}
</script>

<template>
  <section class="mx-auto max-w-6xl p-3 md:p-6">
    <!-- Toolbar -->
    <div class="mb-3 flex items-center justify-between gap-2">
      <h1 class="text-xl font-semibold">{{ t('library.title') }}</h1>
      <IconMdiButton
          :icon-path="mdiPlus"
          :label="t('library.addGame') as string"
          variant="primary"
          size="md"
          @click="onCreate"
      />
    </div>

    <!-- Search (full row, emphasized) -->
    <div class="mb-3">
      <input
          v-model.trim="q"
          :placeholder="t('library.searchByName')"
          class="w-full rounded-2xl border border-indigo-700/40 bg-zinc-950 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring focus:ring-indigo-600/40"
      />
    </div>

    <!-- Filters -->
    <div class="mb-4">
      <!-- Toggle SEMPRE visibile -->
      <button
          type="button"
          class="mb-2 flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
          @click="showFilters = !showFilters"
          :aria-expanded="showFilters ? 'true' : 'false'"
          :aria-controls="'filters-panel'"
      >
    <span class="inline-flex items-center gap-2">
      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="mdiFilter" fill="currentColor" />
      </svg>
      {{ t('library.filters') }}
    </span>

        <span class="inline-flex items-center gap-2 text-indigo-400">
      {{ showFilters ? t('library.hideFilters') : t('library.showFilters') }}
      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="showFilters ? mdiChevronUp : mdiChevronDown" fill="currentColor" />
      </svg>
    </span>
      </button>

      <!-- Pannello filtri -->
      <div
          :id="'filters-panel'"
          v-show="showFilters"
          class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3"
      >
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-zinc-300">
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="mdiFilter" fill="currentColor" />
            </svg>
            <span>{{ t('library.filters') }}</span>
          </div>
          <button
              type="button"
              class="text-sm text-indigo-300 hover:underline"
              @click="clearAll"
          >
            {{ t('library.clearAll') }}
          </button>
        </div>

        <div
            v-if="store.error"
            class="mb-2 rounded-xl border border-red-800 bg-red-900/30 p-2 text-sm text-red-200"
            role="alert"
        >
          {{ store.error }}
        </div>

        <!-- griglia dei filtri (immutata) -->
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3" :aria-busy="store.isLoading">
          <!-- favorite (switch) -->
          <UiSwitch
              v-model="favoriteOnly"
              :label="t('library.onlyFavorites') as string"
              :description="t('library.onlyFavoritesHint') as string"
          />

          <!-- one-shot (switch) -->
          <UiSwitch
              v-model="onlyOneShot"
              :label="t('library.onlyOneShot') as string"
              :description="t('library.onlyOneShotHint') as string"
          />

          <!-- players max -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.playersMax') }}</label>
            <input
                v-model.number="playersMax"
                type="number"
                min="1"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
          </div>

          <!-- difficulty -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.difficulty') }}</label>
            <select
                v-model="difficulty"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="any">{{ t('library.any') }}</option>
              <option value="easy">{{ t('library.difficulties.easy') }}</option>
              <option value="medium">{{ t('library.difficulties.medium') }}</option>
              <option value="hard">{{ t('library.difficulties.hard') }}</option>
            </select>
          </div>

          <!-- duration max -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.durationMax') }}</label>
            <input
                v-model.number="durationMax"
                type="number"
                min="0"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
          </div>

          <!-- rating -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.minRating') }}</label>
            <RatingStars v-model="minRating" />
          </div>

          <!-- genre -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.genre') }}</label>
            <select
                v-model="genreId"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="any">{{ t('library.any') }}</option>
              <option v-for="g in store.genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>

          <!-- mode: coop/competitive -->
          <div>
            <label class="block text-xs text-zinc-400">{{ t('library.mode') }}</label>
            <select
                v-model="mode"
                class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="any">{{ t('library.any') }}</option>
              <option value="coop">{{ t('library.coop') }}</option>
              <option value="competitive">{{ t('library.competitive') }}</option>
            </select>
          </div>

          <!-- Age (pills from games) -->
          <div class="md:col-span-3">
            <label class="block text-xs text-zinc-400 mb-1">
              {{ t('library.age') }}
            </label>

            <div class="flex flex-wrap gap-2">
              <button
                  v-for="a in availableAges"
                  :key="a"
                  type="button"
                  @click="toggleAge(a)"
                  class="inline-flex items-center rounded-full border px-3 py-1 text-sm transition"
                  :class="agesSelected.includes(a)
              ? 'border-indigo-600 bg-indigo-600/20 text-indigo-200'
              : 'border-zinc-700 bg-zinc-800/70 text-zinc-200 hover:border-indigo-600'"
                  :aria-pressed="agesSelected.includes(a) ? 'true' : 'false'"
              >
                {{ a }}+
              </button>

              <button
                  v-if="agesSelected.length"
                  type="button"
                  @click="agesSelected = []"
                  class="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300 hover:border-red-700 hover:text-red-200"
              >
                {{ t('library.clearAges') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results header -->
    <div class="mb-2 text-sm text-zinc-400">
      {{ resultsText }}
    </div>

    <!-- List -->
    <div class="grid grid-cols-1 gap-3 auto-rows-fr">
      <GameCard
          v-for="g in filtered"
          :key="g.id"
          :game="g"
          :genre-name="genreNameById(g.genreId)"
          class="h-full"
      />
    </div>
  </section>
</template>
