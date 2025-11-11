<script setup lang="ts">
import { ref } from 'vue'
import { mdiClose, mdiPlus } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import type { Player } from '@/types/player'
import CreatePlayerModal from './CreatePlayerModal.vue'

const emit = defineEmits(['close', 'save'])

const teamName = ref('')
const selectedPlayers = ref<Player[]>([])
const showCreatePlayerModal = ref(false)

// Dati di esempio
const allPlayers = ref<Player[]>([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
])

function save() {
  if (teamName.value.trim() && selectedPlayers.value.length > 0) {
    const name = teamName.value.trim()
    emit('save', { id: Date.now().toString(), name, playerIds: selectedPlayers.value.map(p => p.id) })
    emit('close')
  }
}

function handlePlayerCreated(newPlayer: Player) {
  allPlayers.value.push(newPlayer)
  selectedPlayers.value.push(newPlayer)
  showCreatePlayerModal.value = false
}
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="w-full max-w-lg rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800">
      <header class="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 class="text-lg font-semibold">Nuovo Team</h2>
        <IconMdiButton :icon-path="mdiClose" variant="ghost" @click="$emit('close')" />
      </header>
      <div class="p-6 space-y-6">
        <div>
          <label for="team-name" class="block text-sm font-medium text-zinc-300 mb-2">Nome Team</label>
          <input
            id="team-name"
            v-model="teamName"
            type="text"
            class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="Es. I magnifici 4"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">Seleziona Giocatori</label>
          <div class="max-h-48 overflow-y-auto rounded-lg border border-zinc-700 p-2 space-y-2">
            <label v-for="player in allPlayers" :key="player.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer">
              <input type="checkbox" :value="player" v-model="selectedPlayers" class="rounded bg-zinc-700 border-zinc-600 text-indigo-500 focus:ring-indigo-600">
              <span>{{ player.name }}</span>
            </label>
          </div>
          <button @click="showCreatePlayerModal = true" class="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <svg class="h-4 w-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            Crea nuovo giocatore
          </button>
        </div>
      </div>
      <footer class="flex justify-end gap-3 p-4 border-t border-zinc-800">
        <button @click="$emit('close')" class="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800">Annulla</button>
        <button @click="save" class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500" :disabled="!teamName.trim() || selectedPlayers.length === 0">Salva Team</button>
      </footer>
    </div>
  </div>

  <CreatePlayerModal v-if="showCreatePlayerModal" @close="showCreatePlayerModal = false" @save="handlePlayerCreated" />
</template>
