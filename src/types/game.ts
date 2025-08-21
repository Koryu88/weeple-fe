export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Genre {
    id: string
    name: string
}

export interface Game {
    id: string
    name: string
    coverUrl?: string
    minAge: number
    playersMin: number
    playersMax: number
    difficulty: Difficulty
    rating: number          // 1..5
    durationMins: number    // single session
    genreId: string         // reference to existing genres
    isOneShot: boolean
    isCoop: boolean
    isCompetitive: boolean
    favorite: boolean
    lastPlayedAt?: string   // ISO date
}

export type GameCreate = Omit<Game, 'id'>
