<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Player } from '@/types/player'
import { mdiChevronLeft } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import RatingStars from '@/components/ui/RatingStars.vue'

const route = useRoute()
const playerId = route.params.id as string

// Mock data - in un'app reale, questi dati verrebbero da uno store/API
const players = ref<Player[]>([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
])

const recentPlays = ref([
    { gameName: 'Catan', date: '2025-10-26', rating: 4, teamName: 'Team A' },
    { gameName: 'Pandemic', date: '2025-11-05', rating: 5, teamName: 'Team B' },
])

const player = computed(() => players.value.find(p => p.id === playerId))

</script>

<template>
  <section v-if="player" class="p-3 md:p-6">
    <header class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-4">
        <BaseAvatar :seed="player.name" type="bottts-neutral" class="w-24 h-24 rounded-full border-2 border-zinc-700" />
        <div>
            <h1 class="text-3xl font-bold">{{ player.name }}</h1>
            <p class="text-zinc-400">Statistiche e attività recenti</p>
        </div>
      </div>
      <IconMdiButton :icon-path="mdiChevronLeft" :to="{ name: 'players' }">
        Tutti i giocatori
      </IconMdiButton>
    </header>

    <div>
      <h2 class="text-xl font-semibold mb-4">Partite Recenti</h2>
      <div class="space-y-3">
        <div v-for="(play, index) in recentPlays" :key="index" class="rounded-lg bg-zinc-900/60 border border-zinc-800 p-4 flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ play.gameName }}</p>
            <p class="text-sm text-zinc-400">Giocata con {{ play.teamName }} il {{ play.date }}</p>
          </div>
          <RatingStars :model-value="play.rating" readonly />
        </div>
        <p v-if="!recentPlays.length" class="text-center text-zinc-500">Nessuna partita recente trovata.</p>
      </div>
    </div>
  </section>
  <section v-else class="p-6 text-center">
      <p class="text-red-400">Giocatore non trovato.</p>
  </section>
</template>
