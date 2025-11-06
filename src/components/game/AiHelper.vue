<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiRobot, mdiClose, mdiSend } from '@mdi/js'
import IconMdiButton from '@/components/ui/IconMdiButton.vue'

const props = defineProps<{
  gameId: string
  gameName: string
}>()

const { t } = useI18n()
const isOpen = ref(false)
const aiQuery = ref('')

// Dati di esempio per la chat
const messages = ref([
  { from: 'ai', text: `Ciao! Sono il tuo assistente per le regole. Chiedimi pure qualcosa su ${props.gameName}.` },
])

function askAi() {
  if (!aiQuery.value.trim()) return

  messages.value.push({ from: 'user', text: aiQuery.value })
  const userQuery = aiQuery.value
  aiQuery.value = ''

  // TODO: Implementare vera interazione con AI
  console.log(`Chiedi a AI per il gioco ${props.gameId}:`, userQuery)

  // Risposta di esempio
  setTimeout(() => {
    messages.value.push({ from: 'ai', text: `Sto cercando informazioni su "${userQuery}"...` })
  }, 1000)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Pannello della chat (visibile quando isOpen è true) -->
    <div
      v-if="isOpen"
      class="mb-4 h-[60vh] w-96 max-w-lg rounded-2xl bg-zinc-900 shadow-2xl flex flex-col border border-zinc-800"
    >
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-zinc-800 p-4 flex-shrink-0">
        <div class="flex items-center gap-3">
          <svg class="h-6 w-6 text-indigo-400" viewBox="0 0 24 24"><path :d="mdiRobot" fill="currentColor" /></svg>
          <h2 class="text-lg font-semibold">{{ t('game.askTheAi') }}</h2>
        </div>
      </header>

      <!-- Area Messaggi -->
      <div class="flex-1 space-y-4 overflow-y-auto p-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex"
          :class="{ 'justify-end': msg.from === 'user' }"
        >
          <div
            class="max-w-sm rounded-2xl px-4 py-2"
            :class="{
              'bg-zinc-800 text-zinc-200': msg.from === 'ai',
              'bg-indigo-600 text-white': msg.from === 'user',
            }"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="border-t border-zinc-800 p-4 flex-shrink-0">
        <div class="flex items-center gap-2">
          <input
            v-model="aiQuery"
            :placeholder="t('game.aiPlaceholder')"
            class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm"
            @keyup.enter="askAi"
          />
          <button
            @click="askAi"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            :disabled="!aiQuery.trim()"
            :aria-label="t('general.send')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24"><path :d="mdiSend" fill="currentColor" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Action Button per aprire/chiudere la chat -->
    <div class="flex justify-end">
      <button
        @click="isOpen = !isOpen"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-100"
        :aria-label="t('game.askTheAi')"
      >
        <svg class="h-8 w-8" viewBox="0 0 24 24">
          <path :d="isOpen ? mdiClose : mdiRobot" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>
