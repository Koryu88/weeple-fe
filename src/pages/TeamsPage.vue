<script setup lang="ts">
import { ref } from 'vue'
import type { Team, Player } from '@/types/player'
import CreateTeamModal from '@/components/player/CreateTeamModal.vue'
import { mdiPlus, mdiAccountGroup, mdiTrashCan } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showCreateTeamModal = ref(false)

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

function getPlayerById(id: string) {
  return players.value.find(p => p.id === id)
}

function handleTeamCreated(newTeam: Team) {
  teams.value.push(newTeam)
  showCreateTeamModal.value = false
}

function deleteTeam(id: string) {
    // TODO: Implementare logica di eliminazione
    console.log('Elimina team:', id)
    teams.value = teams.value.filter(t => t.id !== id)
}
</script>

<template>
  <section class="p-3 md:p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ t('pages.teams') }}</h1>
      <IconMdiButton :icon-path="mdiPlus" @click="showCreateTeamModal = true">
        {{ t('teams.addTeam') }}
      </IconMdiButton>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="team in teams" :key="team.id" class="relative group rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 transition-colors hover:border-indigo-600/50">
        <router-link :to="{ name: 'team-detail', params: { id: team.id } }" class="block">
          <div class="flex items-center gap-4 mb-4">
            <BaseAvatar :seed="team.name" type="identicon" class="w-16 h-16 rounded-full border-2 border-zinc-700" />
            <h2 class="text-xl font-semibold">{{ team.name }}</h2>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-zinc-400 mb-2">Membri</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="playerId in team.playerIds" :key="playerId" class="flex items-center gap-2 bg-zinc-800 rounded-full pr-3">
                <BaseAvatar v-if="getPlayerById(playerId)" :seed="getPlayerById(playerId)!.name" type="bottts-neutral" class="w-6 h-6 rounded-full" />
                <span class="text-sm">{{ getPlayerById(playerId)?.name }}</span>
              </div>
            </div>
          </div>
        </router-link>
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconMdiButton :icon-path="mdiTrashCan" variant="ghost" size="sm" @click.stop="deleteTeam(team.id)" />
        </div>
      </div>
    </div>
  </section>

  <CreateTeamModal v-if="showCreateTeamModal" @close="showCreateTeamModal = false" @save="handleTeamCreated" />
</template>
