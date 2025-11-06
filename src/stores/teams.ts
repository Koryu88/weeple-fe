import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Team } from '@/types/player';

export const useTeamsStore = defineStore('teams', () => {
    const teams = ref<Team[]>([
        { id: 't1', name: 'Team A', playerIds: ['1', '2', '3'] },
        { id: 't2', name: 'Team B', playerIds: ['4', '5', '6'] },
    ]);

    function getTeamById(id: string) {
        return teams.value.find(t => t.id === id);
    }

    return {
        teams,
        getTeamById,
    };
});

