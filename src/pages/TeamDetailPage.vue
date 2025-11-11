<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Team, Player } from '@/types/player'
import { mdiChevronLeft } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import RatingStars from '@/components/ui/RatingStars.vue'

const route = useRoute()
const teamId = route.params.id as string

// Mock data
const players = ref<Player[]>([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
])

const teams = ref<Team[]>([
  { id: 't1', name: 'Team A', playerIds: ['1', '2'] },
  { id: 't2', name: 'Team B', playerIds: ['2', '3'] },
])

const recentPlays = ref([
    { gameName: 'Catan', date: '2025-10-26', rating: 4 },
    { gameName: 'The Crew', date: '2025-08-02', rating: 4 },
])

const team = computed(() => teams.value.find(t => t.id === teamId))

function getPlayerById(id: string) {
  return players.value.find(p => p.id === id)
}
</script>

<template>
  <section v-if="team" class="p-3 md:p-6">
    <header class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-4">
        <BaseAvatar :seed="team.name" type="identicon" class="w-24 h-24 rounded-full border-2 border-zinc-700" />
        <div>
            <h1 class="text-3xl font-bold">{{ team.name }}</h1>
            <div class="flex flex-wrap gap-2 mt-2">
                <div v-for="playerId in team.playerIds" :key="playerId" class="flex items-center gap-2 bg-zinc-800 rounded-full pr-3">
                    <BaseAvatar v-if="getPlayerById(playerId)" :seed="getPlayerById(playerId)!.name" type="bottts-neutral" class="w-6 h-6 rounded-full" />
                    <span class="text-sm">{{ getPlayerById(playerId)?.name }}</span>
                </div>
            </div>
        </div>
      </div>
      <IconMdiButton :icon-path="mdiChevronLeft" :to="{ name: 'teams' }">
        Tutti i team
      </IconMdiButton>
    </header>

    <div>
      <h2 class="text-xl font-semibold mb-4">Partite Recenti</h2>
      <div class="space-y-3">
        <div v-for="(play, index) in recentPlays" :key="index" class="rounded-lg bg-zinc-900/60 border border-zinc-800 p-4 flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ play.gameName }}</p>
            <p class="text-sm text-zinc-400">Giocata il {{ play.date }}</p>
          </div>
          <RatingStars :model-value="play.rating" readonly />
        </div>
        <p v-if="!recentPlays.length" class="text-center text-zinc-500">Nessuna partita recente trovata.</p>
      </div>
    </div>
  </section>
  <section v-else class="p-6 text-center">
      <p class="text-red-400">Team non trovato.</p>
  </section>
</template>
