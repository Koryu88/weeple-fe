import type { Game, Genre, GameCreate } from '@/types/game'

export interface IGamesService {
    listGames(): Promise<Game[]>
    listGenres(): Promise<Genre[]>
    createGame(payload: GameCreate): Promise<Game>
}

export class ApiGamesService implements IGamesService {
    constructor(private baseUrl: string) {}

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
    ]

    async listGames() { return structuredClone(this.games) }
    async listGenres() { return structuredClone(this.genres) }
    async createGame(payload: GameCreate) {
        const g: Game = { id: `g${Date.now()}`, ...payload }
        this.games.unshift(g)
        return g
    }
}
