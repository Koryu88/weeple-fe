import type { Play } from '@/types/play';
import type { Game } from '@/types/game';
import type { Team } from '@/types/player';
import { MockGamesService } from './games.service';

export interface IPlaysService {
    listPlays(): Promise<Play[]>;
}

export class MockPlaysService implements IPlaysService {
    private plays: Play[] = [
        { id: 'p1', gameId: 'g1', teamId: 't1', date: '2025-10-26', rating: 4 },
        { id: 'p2', gameId: 'g2', teamId: 't2', date: '2025-11-05', rating: 5 },
        { id: 'p3', gameId: 'g3', teamId: 't1', date: '2025-08-02', rating: 4 },
        { id: 'p4', gameId: 'g4', teamId: 't2', date: '2025-09-10', rating: 3 },
        { id: 'p5', gameId: 'g1', teamId: 't1', date: '2025-07-15', rating: 5 },
        { id: 'p6', gameId: 'g5', teamId: 't2', date: '2025-10-01', rating: 4 },
        { id: 'p7', gameId: 'g6', teamId: 't1', date: '2025-10-22', rating: 3 },
        { id: 'p8', gameId: 'g7', teamId: 't2', date: '2025-11-05', rating: 5 },
        { id: 'p9', gameId: 'g1', teamId: 't1', date: '2025-06-15', rating: 4 },
        { id: 'p10', gameId: 'g2', teamId: 't2', date: '2025-07-08', rating: 5 },
    ];

    async listPlays(): Promise<Play[]> {
        return structuredClone(this.plays);
    }
}

