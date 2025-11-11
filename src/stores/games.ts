import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Game, Genre, GameCreate } from '@/types/game'
import { ApiGamesService, MockGamesService, type IGamesService } from '@/services/games.service'

export const useGamesStore = defineStore('games', () => {
    const useMock = import.meta.env.VITE_USE_MOCK === 'true'
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    const service: IGamesService = useMock ? new MockGamesService() : new ApiGamesService(apiBase)

    const genres = ref<Genre[]>([])
    const games = ref<Game[]>([])
    const currentGame = ref<Game | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function fetchGames() {
        isLoading.value = true
        error.value = null
        try {
            const [genresData, gamesData] = await Promise.all([
                service.listGenres(),
                service.listGames(),
            ])
            genres.value = genresData
            games.value = gamesData
        } catch (e: any) {
            error.value = e?.message || 'Failed to load games'
        } finally {
            isLoading.value = false
        }
    }

    async function loadGameById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const loadedGame = await service.getGameById(id)
            if (!games.value.some(g => g.id === loadedGame.id)) {
                games.value.push(loadedGame)
            }
            currentGame.value = loadedGame
        } catch (e: any) {
            error.value = e?.message || `Failed to load game ${id}`
        } finally {
            isLoading.value = false
        }
    }

    async function createGame(payload: GameCreate) {
        const created = await service.createGame(payload)
        games.value.unshift(created)
        return created
    }

    async function updateGame(id: string, payload: Partial<GameCreate>) {
        // Mock implementation for now
        const index = games.value.findIndex(g => g.id === id)
        if (index !== -1) {
            const updatedGame = { ...games.value[index], ...payload }
            games.value.splice(index, 1, updatedGame)
            if (currentGame.value?.id === id) currentGame.value = updatedGame
            return Promise.resolve(updatedGame)
        }
        return Promise.reject(new Error('Game not found'))
    }

    const getGameById = (id: string) => games.value.find(g => g.id === id)

    return {
        genres,
        games,
        currentGame,
        isLoading,
        error,
        fetchGames,
        loadGameById,
        createGame,
        updateGame,
        getGameById,
    }
})
