<script setup lang="ts">
import { ref } from 'vue'
import { mdiClose, mdiPlus } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import type { Team } from '@/types/player'
import CreateTeamModal from '@/components/player/CreateTeamModal.vue'

const props = defineProps<{
  gameName: string
}>()

const emit = defineEmits(['close', 'save'])

const selectedTeam = ref<Team | null>(null)
const rating = ref(0)
const showCreateTeamModal = ref(false)

// Dati di esempio
const allTeams = ref<Team[]>([
  { id: 't1', name: 'Team A', playerIds: ['1', '2'] },
  { id: 't2', name: 'Team B', playerIds: ['2', '3'] },
])

function save() {
  if (selectedTeam.value && rating.value > 0) {
    // TODO: Implementare salvataggio della partita
    console.log('Salvataggio partita:', { teamId: selectedTeam.value.id, rating: rating.value })
    emit('save', { teamId: selectedTeam.value.id, rating: rating.value })
    emit('close')
  }
}

function handleTeamCreated(newTeam: Team) {
  allTeams.value.push(newTeam)
  selectedTeam.value = newTeam
  showCreateTeamModal.value = false
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="w-full max-w-lg rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800">
      <header class="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 class="text-lg font-semibold">Aggiungi Partita a <span class="text-indigo-400">{{ gameName }}</span></h2>
        <IconMdiButton :icon-path="mdiClose" variant="ghost" @click="$emit('close')" />
      </header>
      <div class="p-6 space-y-6">
        <div>
          <label for="team-select" class="block text-sm font-medium text-zinc-300 mb-2">Seleziona Team</label>
          <select
            id="team-select"
            v-model="selectedTeam"
            class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option :value="null" disabled>Scegli un team...</option>
            <option v-for="team in allTeams" :key="team.id" :value="team">{{ team.name }}</option>
          </select>
          <button @click="showCreateTeamModal = true" class="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <svg class="h-4 w-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            Crea nuovo team
          </button>
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">Valutazione Partita</label>
          <RatingStars v-model="rating" />
        </div>
      </div>
      <footer class="flex justify-end gap-3 p-4 border-t border-zinc-800">
        <button @click="$emit('close')" class="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800">Annulla</button>
        <button @click="save" class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500" :disabled="!selectedTeam || rating === 0">Salva Partita</button>
      </footer>
    </div>
  </div>

  <CreateTeamModal v-if="showCreateTeamModal" @close="showCreateTeamModal = false" @save="handleTeamCreated" />
</template>

