export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Genre {
    id: string
    name: string
}

export interface GameCreate {
    name: string
    minAge: number
    playersMin: number
    playersMax: number
    difficulty: Difficulty
    durationMins: number    // single session
    genreId: string         // reference to existing genres
    isOneShot: boolean
    isCoop: boolean
    isCompetitive: boolean
    coverUrl?: string
    description?: string
    manualUrl?: string // URL del manuale PDF
}

export interface Game extends GameCreate {
    id: string
    rating: number // 0..5
    favorite: boolean
    lastPlayedAt?: string // YYYY-MM-DD
    description?: string
    // manualUrl eredita da GameCreate
}
