import type { Game, Genre, GameCreate } from '@/types/game'

export interface IGamesService {
    listGames(): Promise<Game[]>
    listGenres(): Promise<Genre[]>
    createGame(payload: GameCreate): Promise<Game>
    getGameById(id: string): Promise<Game>
}

export class ApiGamesService implements IGamesService {
    private readonly baseUrl: string
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async listGames(): Promise<Game[]> {
        const res = await fetch(`${this.baseUrl}/games`)
        if (!res.ok) throw new Error('Failed to fetch games')
        return await res.json()
    }

    async listGenres(): Promise<Genre[]> {
        const res = await fetch(`${this.baseUrl}/genres`)
        if (!res.ok) throw new Error('Failed to fetch genres')
        return await res.json()
    }

    async createGame(payload: GameCreate): Promise<Game> {
        const res = await fetch(`${this.baseUrl}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create game')
        return await res.json()
    }

    async getGameById(id: string): Promise<Game> {
        const res = await fetch(`${this.baseUrl}/games/${id}`)
        if (!res.ok) throw new Error(`Failed to fetch game with id ${id}`)
        return await res.json()
    }
}

export class MockGamesService implements IGamesService {
    private genres: Genre[] = [
        { id: 'party', name: 'Party' },
        { id: 'strategy', name: 'Strategy' },
        { id: 'family', name: 'Family' },
        { id: 'thematic', name: 'Thematic' },
    ]

    private games: Game[] = [
        {
            id: 'g1',
            name: 'Catan',
            coverUrl: 'https://picsum.photos/seed/catan/400/280',
            minAge: 10,
            playersMin: 3,
            playersMax: 4,
            difficulty: 'medium',
            rating: 4,
            durationMins: 75,
            genreId: 'strategy',
            isOneShot: true,
            isCoop: false,
            isCompetitive: true,
            favorite: true,
            lastPlayedAt: '2025-06-15',
        },
        {
            id: 'g2',
            name: 'Pandemic',
            coverUrl: 'https://picsum.photos/seed/pandemic/400/280',
            minAge: 8,
            playersMin: 2,
            playersMax: 4,
            difficulty: 'medium',
            rating: 5,
            durationMins: 60,
            genreId: 'family',
            isOneShot: true,
            isCoop: true,
            isCompetitive: false,
            favorite: false,
            lastPlayedAt: '2025-07-08',
        },
        {
            id: 'g3',
            name: 'The Crew',
            coverUrl: 'https://picsum.photos/seed/crew/400/280',
            minAge: 10,
            playersMin: 3,
            playersMax: 5,
            difficulty: 'easy',
            rating: 4,
            durationMins: 20,
            genreId: 'party',
            isOneShot: true,
            isCoop: true,
            isCompetitive: false,
            favorite: false,
            lastPlayedAt: '2025-08-02',
        },
        {
            id: 'g4',
            name: 'Ticket to Ride',
            coverUrl: 'https://picsum.photos/seed/ttr/400/280',
            minAge: 8,
            playersMin: 2,
            playersMax: 5,
            difficulty: 'easy',
            rating: 4,
            durationMins: 60,
            genreId: 'family',
            isOneShot: true,
            isCoop: false,
            isCompetitive: true,
            favorite: true,
            lastPlayedAt: '2025-09-10',
        },
        {
            id: 'g5',
            name: '7 Wonders',
            coverUrl: 'https://picsum.photos/seed/7wonders/400/280',
            minAge: 10,
            playersMin: 2,
            playersMax: 7,
            difficulty: 'medium',
            rating: 4,
            durationMins: 30,
            genreId: 'strategy',
            isOneShot: true,
            isCoop: false,
            isCompetitive: true,
            favorite: false,
            lastPlayedAt: '2025-10-01',
        },
        {
            id: 'g6',
            name: 'Codenames',
            coverUrl: 'https://picsum.photos/seed/codenames/400/280',
            minAge: 14,
            playersMin: 2,
            playersMax: 8,
            difficulty: 'easy',
            rating: 4,
            durationMins: 15,
            genreId: 'party',
            isOneShot: true,
            isCoop: false,
            isCompetitive: true,
            favorite: false,
            lastPlayedAt: '2025-10-22',
        },
        {
            id: 'g7',
            name: 'Gloomhaven',
            coverUrl: 'https://picsum.photos/seed/gloomhaven/400/280',
            minAge: 14,
            playersMin: 1,
            playersMax: 4,
            difficulty: 'hard',
            rating: 5,
            durationMins: 120,
            genreId: 'thematic',
            isOneShot: false,
            isCoop: true,
            isCompetitive: false,
            favorite: false,
            lastPlayedAt: '2025-11-05',
        },
    ]

    async listGames() { return structuredClone(this.games) }
    async listGenres() { return structuredClone(this.genres) }

    async getGameById(id: string): Promise<Game> {
        const game = this.games.find((g) => g.id === id)
        if (!game) throw new Error(`Game with id ${id} not found`)
        return Promise.resolve(structuredClone(game))
    }

    async createGame(payload: GameCreate): Promise<Game> {
        const newGame: Game = {
            id: `g${this.games.length + 1}`,
            ...payload,
            rating: 0, // default value
            favorite: false,
            lastPlayedAt: undefined,
            coverUrl: 'https://picsum.photos/seed/new/400/280',
        }
        this.games.unshift(newGame)
        return Promise.resolve(structuredClone(newGame))
    }
}
