<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGamesStore } from '@/stores/games';
import type { GameCreate, Genre } from '@/types/game';
import UiSwitch from '@/components/ui/UiSwitch.vue';
import { mdiChevronLeft } from '@mdi/js';
import IconMdiButton from '@/components/ui/IconMdiButton.vue';

const route = useRoute();
const router = useRouter();
const gamesStore = useGamesStore();

const gameId = route.params.id as string | undefined;
const isEditMode = computed(() => !!gameId);

const form = ref<GameCreate & { manualUrl?: string }>({
    name: '',
    minAge: 8,
    playersMin: 1,
    playersMax: 4,
    durationMins: 30,
    difficulty: 'medium',
    genreId: '',
    isCoop: false,
    isCompetitive: true,
    isOneShot: true,
    coverUrl: '',
    description: '',
    manualUrl: '',
});

const coverImageFile = ref<File | null>(null);
const instructionsPdfFile = ref<File | null>(null);

onMounted(async () => {
    if (!gamesStore.genres.length) {
        await gamesStore.fetchGames();
    }
    if (isEditMode.value && gameId) {
        await gamesStore.loadGameById(gameId);
        const gameData = gamesStore.getGameById(gameId);
        if (gameData) {
            form.value = { ...gameData };
        }
    }
    if (!form.value.genreId && gamesStore.genres.length > 0) {
        form.value.genreId = gamesStore.genres[0].id;
    }
});

const genres = computed<Genre[]>(() => gamesStore.genres);
const difficulties: GameCreate['difficulty'][] = ['easy', 'medium', 'hard'];

function handleFileUpload(event: Event, type: 'cover' | 'pdf') {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        if (type === 'cover') {
            coverImageFile.value = target.files[0];
            form.value.coverUrl = '';
        } else {
            instructionsPdfFile.value = target.files[0];
            // placeholder: salvo solo nome file localmente
            form.value.manualUrl = `/sample.pdf`;
        }
    }
}

async function handleSubmit() {
    const payload: GameCreate = {
        name: form.value.name,
        minAge: form.value.minAge,
        playersMin: form.value.playersMin,
        playersMax: form.value.playersMax,
        durationMins: form.value.durationMins,
        difficulty: form.value.difficulty,
        genreId: form.value.genreId,
        isCoop: form.value.isCoop,
        isCompetitive: form.value.isCompetitive,
        isOneShot: form.value.isOneShot,
        coverUrl: form.value.coverUrl || undefined,
        description: form.value.description || undefined,
        manualUrl: form.value.manualUrl || undefined,
    };

    try {
        if (isEditMode.value && gameId) {
            const updatedGame = await gamesStore.updateGame(gameId, payload);
            router.push({ name: 'game-detail', params: { id: updatedGame.id } });
        } else {
            const newGame = await gamesStore.createGame(payload);
            router.push({ name: 'game-detail', params: { id: newGame.id } });
        }
    } catch (error) {
        console.error('Failed to save game:', error);
        alert('Errore durante il salvataggio del gioco.');
    }
}
</script>

<template>
    <section class="p-4 sm:p-6">
        <header class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-bold">{{ isEditMode ? 'Modifica Gioco' : 'Nuovo Gioco' }}</h1>
            <IconMdiButton :icon-path="mdiChevronLeft" @click="router.back()">
                Indietro
            </IconMdiButton>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl mx-auto">
            <!-- Name -->
            <div>
                <label for="name" class="block text-sm font-medium text-zinc-300">Nome</label>
                <input type="text" id="name" v-model="form.name" required class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
            </div>

            <!-- Cover Image -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-zinc-300">Immagine di copertina</label>
                <div class="flex items-center gap-4">
                    <div class="flex-grow">
                        <label for="coverUrl" class="sr-only">URL Immagine</label>
                        <input type="url" id="coverUrl" v-model="form.coverUrl" placeholder="https://example.com/image.jpg" :disabled="!!coverImageFile" class="w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50">
                    </div>
                    <span class="text-zinc-400">o</span>
                    <label for="coverFile" class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-zinc-700 text-sm font-medium rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M12.75 7.502a.75.75 0 00-1.5 0v2.25h-2.25a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5h-2.25v-2.25z" /><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5.172a2 2 0 01-1.414-.586l-.707-.707A2 2 0 006.828 4H4zm0 2h2.828a.5.5 0 01.353.146l.707.707a.5.5 0 00.354.147H16v6a.5.5 0 01-.5.5H4.5a.5.5 0 01-.5-.5V6z" clip-rule="evenodd" /></svg>
                        <span>Carica File</span>
                        <input id="coverFile" type="file" @change="handleFileUpload($event, 'cover')" accept="image/*" class="hidden">
                    </label>
                </div>
                <p v-if="coverImageFile" class="text-sm text-zinc-400">File selezionato: {{ coverImageFile.name }}</p>
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-sm font-medium text-zinc-300">Descrizione</label>
                <textarea id="description" v-model="form.description" rows="4" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>

            <!-- Players & Duration -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="playersMin" class="block text-sm font-medium text-zinc-300">Min Giocatori</label>
                    <input type="number" id="playersMin" v-model.number="form.playersMin" min="1" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                </div>
                <div>
                    <label for="playersMax" class="block text-sm font-medium text-zinc-300">Max Giocatori</label>
                    <input type="number" id="playersMax" v-model.number="form.playersMax" min="1" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                </div>
                <div>
                    <label for="durationMins" class="block text-sm font-medium text-zinc-300">Durata (min)</label>
                    <input type="number" id="durationMins" v-model.number="form.durationMins" min="5" step="5" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                </div>
            </div>

            <!-- Age, Difficulty, Genre -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="minAge" class="block text-sm font-medium text-zinc-300">Età Minima</label>
                    <input type="number" id="minAge" v-model.number="form.minAge" min="3" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                </div>
                <div>
                    <label for="difficulty" class="block text-sm font-medium text-zinc-300">Difficoltà</label>
                    <select id="difficulty" v-model="form.difficulty" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                        <option v-for="d in difficulties" :key="d" :value="d">{{ d }}</option>
                    </select>
                </div>
                <div>
                    <label for="genre" class="block text-sm font-medium text-zinc-300">Genere</label>
                    <select id="genre" v-model="form.genreId" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
                        <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Toggles -->
            <div class="flex items-center flex-wrap gap-6">
                <UiSwitch v-model="form.isCoop" label="Cooperativo" />
                <UiSwitch v-model="form.isCompetitive" label="Competitivo" />
                <UiSwitch v-model="form.isOneShot" label="One-Shot" />
            </div>

            <!-- Manual URL -->
            <div>
                <label for="manualUrl" class="block text-sm font-medium text-zinc-300">Manuale (URL PDF)</label>
                <input type="url" id="manualUrl" v-model="form.manualUrl" placeholder="https://example.com/manual.pdf" class="mt-1 block w-full bg-zinc-800 border-zinc-700 rounded-md shadow-sm">
            </div>

            <!-- Instructions upload -->
            <div>
                <label class="block text-sm font-medium text-zinc-300">Manuale di istruzioni (Upload PDF)</label>
                <label for="pdfFile" class="mt-1 cursor-pointer flex justify-center items-center gap-2 w-full px-6 py-3 border-2 border-zinc-700 border-dashed rounded-md">
                    <svg class="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11v6m-3-3h6" /></svg>
                    <span class="text-sm text-zinc-400">{{ instructionsPdfFile ? instructionsPdfFile.name : 'Clicca per caricare un PDF' }}</span>
                    <input id="pdfFile" type="file" @change="handleFileUpload($event, 'pdf')" accept=".pdf" class="hidden">
                </label>
            </div>

            <!-- Submit -->
            <div class="pt-4 flex justify-end">
                <button type="submit" class="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    {{ isEditMode ? 'Salva Modifiche' : 'Crea Gioco' }}
                </button>
            </div>
        </form>
    </section>
</template>
