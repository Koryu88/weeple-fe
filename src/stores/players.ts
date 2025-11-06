import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Player } from '@/types/player';

export const usePlayersStore = defineStore('players', () => {
    const players = ref<Player[]>([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
        { id: '4', name: 'David' },
        { id: '5', name: 'Eve' },
        { id: '6', name: 'Frank' },
    ]);

    function getPlayerById(id: string) {
        return players.value.find(p => p.id === id);
    }

    return {
        players,
        getPlayerById,
    };
});

