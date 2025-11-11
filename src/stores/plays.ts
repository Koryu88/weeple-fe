import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Play } from '@/types/play';
import { MockPlaysService } from '@/services/plays.service';

export const usePlaysStore = defineStore('plays', () => {
    const plays = ref<Play[]>([]);
    const playsService = new MockPlaysService();

    const fetchPlays = async () => {
        plays.value = await playsService.listPlays();
    };

    return {
        plays,
        fetchPlays,
    };
});
