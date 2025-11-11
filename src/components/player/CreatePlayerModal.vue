<script setup lang="ts">
import { ref } from 'vue'
import { mdiClose } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'

const emit = defineEmits(['close', 'save'])

const playerName = ref('')

function save() {
  if (playerName.value.trim()) {
    const name = playerName.value.trim()
    emit('save', { id: Date.now().toString(), name })
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="w-full max-w-md rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800">
      <header class="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 class="text-lg font-semibold">Nuovo Giocatore</h2>
        <IconMdiButton :icon-path="mdiClose" variant="ghost" @click="$emit('close')" />
      </header>
      <div class="p-6">
        <label for="player-name" class="block text-sm font-medium text-zinc-300 mb-2">Nome Giocatore</label>
        <input
          id="player-name"
          v-model="playerName"
          type="text"
          class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="Es. Mario Rossi"
          @keyup.enter="save"
        />
      </div>
      <footer class="flex justify-end gap-3 p-4 border-t border-zinc-800">
        <button @click="$emit('close')" class="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800">Annulla</button>
        <button @click="save" class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500" :disabled="!playerName.trim()">Salva Giocatore</button>
      </footer>
    </div>
  </div>
</template>
