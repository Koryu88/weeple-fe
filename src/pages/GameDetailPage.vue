<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGamesStore } from '@/stores/games'
import { useI18n } from 'vue-i18n'
import {mdiChevronLeft, mdiFilePdfBox, mdiMagnify, mdiPlus, mdiPencil} from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import AiHelper from '@/components/game/AiHelper.vue'
import AddPlayModal from '@/components/play/AddPlayModal.vue'

const store = useGamesStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const gameId = route.params.id as string
const showAddPlayModal = ref(false)

const pdfQuery = ref('')

// Dati di esempio per la tabella delle giocate
const plays = ref([
  { id: 1, date: '2024-10-26', team: 'Team A', rating: 4 },
  { id: 2, date: '2024-11-05', team: 'Team B', rating: 5 },
])

onMounted(() => {
  // Assumendo che esista un metodo per caricare un singolo gioco
  if (!store.games.length) {
    store.loadGameById(gameId)
  }
})

const game = computed(() => store.games.find(g => g.id === gameId))
const genreName = computed(() => store.genres.find(g => g.id === game.value?.genreId)?.name || '-')

function goBack() {
  router.push('/library')
}

function searchInPdf() {
  // TODO: Implementare ricerca nel PDF
  console.log('Ricerca nel PDF:', pdfQuery.value)
}


function handlePlaySaved(playData: any) {
  // TODO: Aggiornare la lista delle partite
  console.log('Partita salvata:', playData)
  showAddPlayModal.value = false
}
</script>

<template>
  <section v-if="store.isLoading" class="p-6 text-center">
    <p>{{ t('general.loading') }}</p>
  </section>

  <section v-else-if="!game" class="p-6 text-center">
    <p class="text-red-400">{{ t('game.notFound') }}</p>
    <IconMdiButton :icon-path="mdiChevronLeft" :label="t('game.backToLibrary')" @click="goBack" class="mt-4" />
  </section>

  <section v-else class="mx-auto max-w-6xl">
    <!-- Immagine di intestazione -->
    <div class="relative h-64 w-full">
      <img :src="game.coverUrl || '/placeholder.jpg'" :alt="game.name" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-6">
        <h1 class="text-4xl font-bold text-white">{{ game.name }}</h1>
      </div>
      <IconMdiButton
        :icon-path="mdiChevronLeft"
        :label="t('game.backToLibrary')"
        @click="goBack"
        class="absolute top-4 left-4"
        variant="secondary"
      />
      <IconMdiButton
        :icon-path="mdiPencil"
        :label="t('general.edit')"
        :to="{ name: 'game-edit', params: { id: game.id } }"
        class="absolute top-4 right-4"
        variant="secondary"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 p-3 md:grid-cols-3 md:p-6">

      <!-- Colonna principale con dettagli -->
      <div class="md:col-span-2">
        <!-- Caratteristiche -->
        <div class="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 class="mb-3 text-lg font-semibold">{{ t('game.features') }}</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><strong class="text-zinc-400">{{ t('library.players') }}:</strong> {{ game.playersMin }}-{{ game.playersMax }}</div>
            <div><strong class="text-zinc-400">{{ t('library.duration') }}:</strong> {{ game.durationMins }} min</div>
            <div><strong class="text-zinc-400">{{ t('library.age') }}:</strong> {{ game.minAge }}+</div>
            <div><strong class="text-zinc-400">{{ t('library.difficulty') }}:</strong> {{ t('library.difficulties.' + game.difficulty) }}</div>
            <div><strong class="text-zinc-400">{{ t('library.genre') }}:</strong> {{ genreName }}</div>
            <div>
                <strong class="text-zinc-400">{{ t('library.mode') }}:</strong>
                <span v-if="game.isCoop">{{ t('library.coop') }}</span>
                <span v-if="game.isCoop && game.isCompetitive"> / </span>
                <span v-if="game.isCompetitive">{{ t('library.competitive') }}</span>
            </div>
            <div><strong class="text-zinc-400">{{ t('library.rating') }}:</strong> <RatingStars :model-value="game.rating" :read-only="true" /></div>
             <div><strong class="text-zinc-400">{{ t('library.oneShot') }}:</strong> {{ game.isOneShot ? t('general.yes') : t('general.no') }}</div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="game.description" class="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h2 class="mb-2 text-lg font-semibold">{{ t('game.description') }}</h2>
            <p class="text-zinc-300 whitespace-pre-wrap">{{ game.description }}</p>
        </div>

        <!-- Istruzioni PDF -->
        <div class="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 class="mb-3 flex items-center gap-2 text-lg font-semibold">
            <svg class="h-6 w-6" viewBox="0 0 24 24"><path :d="mdiFilePdfBox" fill="currentColor" /></svg>
            {{ t('game.instructions') }}
          </h2>
          <div class="flex gap-2">
            <input
              v-model="pdfQuery"
              :placeholder="t('game.searchInPdf')"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            />
            <IconMdiButton :icon-path="mdiMagnify" @click="searchInPdf" :label="t('general.search')" />
          </div>
          <div class="mt-4 h-96 rounded-lg border border-zinc-700 bg-zinc-950 p-2">
            <!-- Qui andrà il visualizzatore PDF -->
            <p class="text-center text-zinc-500">{{ t('game.pdfViewerPlaceholder') }}</p>
          </div>
        </div>
      </div>

      <!-- Colonna laterale con giocate -->
      <div class="md:col-span-1">
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold">{{ t('game.plays') }}</h2>
            <IconMdiButton :icon-path="mdiPlus" size="sm" @click="showAddPlayModal = true" :label="t('game.addPlay')" />
          </div>
          <div class="space-y-3">
            <div v-for="play in plays" :key="play.id" class="rounded-lg bg-zinc-800/50 p-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="font-semibold">{{ play.team }}</span>
                <RatingStars :model-value="play.rating" :read-only="true" size="sm" />
              </div>
              <div class="text-xs text-zinc-400">{{ play.date }}</div>
            </div>
            <p v-if="!plays.length" class="text-center text-sm text-zinc-500">{{ t('game.noPlaysYet') }}</p>
          </div>
        </div>
      </div>
    </div>

    <AiHelper v-if="game.id" :game-id="game.id" :game-name="game.name" />
    <AddPlayModal v-if="showAddPlayModal" :game-name="game.name" @close="showAddPlayModal = false" @save="handlePlaySaved" />
  </section>
</template>
