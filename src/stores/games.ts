import { defineStore } from 'pinia'
import type { Game, Genre, GameCreate } from '@/types/game'
import { ApiGamesService, MockGamesService, type IGamesService } from '@/services/games.service'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const apiBase = import.meta.env.VITE_API_BASE_URL || ''
const service: IGamesService = useMock ? new MockGamesService() : new ApiGamesService(apiBase)

export const useGamesStore = defineStore('games', {
    state: () => ({
        genres: [] as Genre[],
        games: [] as Game[],
        isLoading: false,
        error: null as string | null,
    }),
    actions: {
        async loadAll() {
            this.isLoading = true
            this.error = null
            try {
                const [genres, games] = await Promise.all([
                    service.listGenres(),
                    service.listGames(),
                ])
                this.genres = genres
                this.games = games
            } catch (e: any) {
                this.error = e?.message || 'Failed to load games'
            } finally {
                this.isLoading = false
            }
        },
        async createGame(payload: GameCreate) {
            const created = await service.createGame(payload)
            this.games.unshift(created)
            return created
        },
    },
})
