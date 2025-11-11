<script setup lang="ts">
import { ref } from 'vue'
import type { Player } from '@/types/player'
import CreatePlayerModal from '@/components/player/CreatePlayerModal.vue'
import { mdiPlus, mdiTrashCan } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showCreatePlayerModal = ref(false)

// Mock data
const players = ref<Player[]>([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
])

function handlePlayerCreated(newPlayer: Player) {
  players.value.push(newPlayer)
  showCreatePlayerModal.value = false
}

function deletePlayer(id: string) {
    // TODO: Implementare logica di eliminazione
    console.log('Elimina giocatore:', id)
    players.value = players.value.filter(p => p.id !== id)
}
</script>

<template>
  <section class="p-3 md:p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ t('pages.players') }}</h1>
      <IconMdiButton :icon-path="mdiPlus" @click="showCreatePlayerModal = true">
        {{ t('players.addPlayer') }}
      </IconMdiButton>
    </header>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div v-for="player in players" :key="player.id" class="relative group rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center transition-colors hover:border-indigo-600/50">
        <router-link :to="{ name: 'player-detail', params: { id: player.id } }" class="flex flex-col items-center gap-2 p-4">
          <BaseAvatar :seed="player.name" type="bottts-neutral" class="w-24 h-24 rounded-full border-2 border-zinc-700" />
          <span class="font-semibold truncate w-full">{{ player.name }}</span>
        </router-link>
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconMdiButton :icon-path="mdiTrashCan" variant="ghost" size="sm" @click.stop="deletePlayer(player.id)" />
        </div>
      </div>
    </div>
  </section>

  <CreatePlayerModal v-if="showCreatePlayerModal" @close="showCreatePlayerModal = false" @save="handlePlayerCreated" />
</template>
