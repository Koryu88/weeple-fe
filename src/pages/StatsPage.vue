<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePlaysStore } from '@/stores/plays';
import { useGamesStore } from '@/stores/games';
import { usePlayersStore } from '@/stores/players';
import { useTeamsStore } from '@/stores/teams';
import BaseAvatar from '@/components/ui/BaseAvatar.vue';
import RatingStars from '@/components/ui/RatingStars.vue';
import BarChart from '@/components/charts/BarChart.vue';
import type { ChartData, ChartOptions } from 'chart.js';

const playsStore = usePlaysStore();
const gamesStore = useGamesStore();
const playersStore = usePlayersStore();
const teamsStore = useTeamsStore();

onMounted(() => {
  playsStore.fetchPlays();
  gamesStore.fetchGames();
});

const latestPlays = computed(() => {
  return playsStore.plays
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(play => {
      const game = gamesStore.getGameById(play.gameId);
      const team = teamsStore.getTeamById(play.teamId);
      return { ...play, game, team };
    });
});

const latestActiveTeams = computed(() => {
  const teamPlayDates: { [key: string]: string } = {};
  playsStore.plays.forEach(play => {
    if (!teamPlayDates[play.teamId] || new Date(play.date) > new Date(teamPlayDates[play.teamId])) {
      teamPlayDates[play.teamId] = play.date;
    }
  });

  return Object.keys(teamPlayDates)
    .sort((a, b) => new Date(teamPlayDates[b]).getTime() - new Date(teamPlayDates[a]).getTime())
    .slice(0, 5)
    .map(teamId => teamsStore.getTeamById(teamId));
});

const latestActivePlayers = computed(() => {
  const playerPlayDates: { [key: string]: string } = {};
  playsStore.plays.forEach(play => {
    const team = teamsStore.getTeamById(play.teamId);
    if (team) {
      team.playerIds.forEach(playerId => {
        if (!playerPlayDates[playerId] || new Date(play.date) > new Date(playerPlayDates[playerId])) {
          playerPlayDates[playerId] = play.date;
        }
      });
    }
  });

  return Object.keys(playerPlayDates)
    .sort((a, b) => new Date(playerPlayDates[b]).getTime() - new Date(playerPlayDates[a]).getTime())
    .slice(0, 5)
    .map(playerId => playersStore.getPlayerById(playerId));
});

const gamePlayCounts = computed(() => {
  const counts: { [key: string]: number } = {};
  playsStore.plays.forEach(play => {
    counts[play.gameId] = (counts[play.gameId] || 0) + 1;
  });
  return counts;
});

const mostPlayedGames = computed(() => {
  return Object.entries(gamePlayCounts.value)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([gameId, count]) => ({ game: gamesStore.getGameById(gameId), count }));
});

const leastPlayedGames = computed(() => {
    const allGameIds = gamesStore.games.map(g => g.id);
    const playedGameIds = Object.keys(gamePlayCounts.value);
    const unplayedGameIds = allGameIds.filter(id => !playedGameIds.includes(id));

    const played = Object.entries(gamePlayCounts.value)
        .sort(([, countA], [, countB]) => countA - countB)
        .map(([gameId, count]) => ({ game: gamesStore.getGameById(gameId), count }));

    const unplayed = unplayedGameIds.map(gameId => ({ game: gamesStore.getGameById(gameId), count: 0 }));

    return [...played, ...unplayed].slice(0, 5);
});

const gameAverageRatings = computed(() => {
  const ratings: { [key: string]: { total: number; count: number } } = {};
  playsStore.plays.forEach(play => {
    if (!ratings[play.gameId]) {
      ratings[play.gameId] = { total: 0, count: 0 };
    }
    ratings[play.gameId].total += play.rating;
    ratings[play.gameId].count++;
  });

  const averages: { [key: string]: number } = {};
  for (const gameId in ratings) {
    averages[gameId] = ratings[gameId].total / ratings[gameId].count;
  }
  return averages;
});

const topRatedGames = computed(() => {
  return Object.entries(gameAverageRatings.value)
    .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
    .slice(0, 5)
    .map(([gameId, avgRating]) => ({ game: gamesStore.getGameById(gameId), avgRating }));
});

const mostActivePlayer = computed(() => {
    const playCounts: { [key: string]: number } = {};
    playsStore.plays.forEach(play => {
        const team = teamsStore.getTeamById(play.teamId);
        if (team) {
            team.playerIds.forEach(playerId => {
                playCounts[playerId] = (playCounts[playerId] || 0) + 1;
            });
        }
    });

    const sortedPlayers = Object.entries(playCounts).sort(([, countA], [, countB]) => countB - countA);
    if (sortedPlayers.length === 0) return null;

    const topPlayerId = sortedPlayers[0][0];
    return { player: playersStore.getPlayerById(topPlayerId), count: sortedPlayers[0][1] };
});

const favoriteGenre = computed(() => {
    const genreCounts: { [key: string]: number } = {};
    playsStore.plays.forEach(play => {
        const game = gamesStore.getGameById(play.gameId);
        if (game) {
            genreCounts[game.genreId] = (genreCounts[game.genreId] || 0) + 1;
        }
    });

    const sortedGenres = Object.entries(genreCounts).sort(([, countA], [, countB]) => countB - countA);
    if (sortedGenres.length === 0) return null;

    const topGenreId = sortedGenres[0][0];
    const genre = gamesStore.genres.find(g => g.id === topGenreId);
    return { genre, count: sortedGenres[0][1] };
});


const mostPlayedGamesChartData = computed<ChartData<'bar'>>(() => ({
    labels: mostPlayedGames.value.map(item => item.game?.name || ''),
    datasets: [
        {
            label: 'Partite Giocate',
            backgroundColor: '#a855f7', // purple-500
            borderRadius: 4,
            data: mostPlayedGames.value.map(item => item.count),
        },
    ],
}));

const topRatedGamesChartData = computed<ChartData<'bar'>>(() => ({
    labels: topRatedGames.value.map(item => item.game?.name || ''),
    datasets: [
        {
            label: 'Valutazione Media',
            backgroundColor: '#f59e0b', // amber-500
            borderRadius: 4,
            data: topRatedGames.value.map(item => item.avgRating),
        },
    ],
}));

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#18181b', // zinc-900
            titleColor: '#f4f4f5', // zinc-100
            bodyColor: '#a1a1aa', // zinc-400
            borderColor: '#3f3f46', // zinc-700
            borderWidth: 1,
        }
    },
    scales: {
        x: {
            ticks: { color: '#a1a1aa' }, // zinc-400
            grid: { color: 'transparent' },
        },
        y: {
            ticks: { color: '#a1a1aa' }, // zinc-400
            grid: { color: '#27272a' }, // zinc-800
        },
    },
}));

</script>

<template>
  <section class="p-4 space-y-8">
    <h1 class="text-3xl font-bold">Statistiche</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- General Stats -->
        <div class="bg-zinc-900/60 p-4 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Statistiche Generali</h2>
            <div v-if="mostActivePlayer" class="flex items-center justify-between py-2">
                <span>Giocatore più attivo:</span>
                <div class="flex items-center gap-2">
                    <BaseAvatar :seed="mostActivePlayer.player?.name" type="bottts-neutral" class="w-8 h-8 rounded-full" />
                    <span class="font-semibold">{{ mostActivePlayer.player?.name }} ({{ mostActivePlayer.count }} partite)</span>
                </div>
            </div>
            <div v-if="favoriteGenre" class="flex items-center justify-between py-2">
                <span>Genere preferito:</span>
                <span class="font-semibold">{{ favoriteGenre.genre?.name }} ({{ favoriteGenre.count }} partite)</span>
            </div>
        </div>

        <!-- Last 5 Plays -->
        <div>
            <h2 class="text-xl font-semibold mb-4">Ultime Partite</h2>
            <div class="space-y-3">
                <div v-for="play in latestPlays" :key="play.id" class="rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 flex items-center justify-between">
                    <div>
                        <p class="font-semibold">{{ play.game?.name }}</p>
                        <p class="text-sm text-zinc-400">Giocata da {{ play.team?.name }} il {{ play.date }}</p>
                    </div>
                    <RatingStars :model-value="play.rating" readonly size="sm" />
                </div>
            </div>
        </div>

        <!-- Last 5 Active Teams -->
        <div>
            <h2 class="text-xl font-semibold mb-4">Team Recenti</h2>
            <div class="space-y-3">
                <div v-for="team in latestActiveTeams" :key="team.id" class="rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 flex items-center gap-3">
                    <BaseAvatar :seed="team.name" type="identicon" class="w-10 h-10 rounded-full" />
                    <span class="font-semibold">{{ team.name }}</span>
                </div>
            </div>
        </div>

        <!-- Last 5 Active Players -->
        <div>
            <h2 class="text-xl font-semibold mb-4">Giocatori Recenti</h2>
            <div class="space-y-3">
                <div v-for="player in latestActivePlayers" :key="player.id" class="rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 flex items-center gap-3">
                    <BaseAvatar :seed="player.name" type="bottts-neutral" class="w-10 h-10 rounded-full" />
                    <span class="font-semibold">{{ player.name }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Most Played Games -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Giochi più giocati</h2>
        <div class="h-64 bg-zinc-900/60 rounded p-2">
            <BarChart :chart-data="mostPlayedGamesChartData" :chart-options="chartOptions" />
        </div>
      </div>

      <!-- Least Played Games -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Giochi meno giocati</h2>
        <div class="space-y-2">
          <div v-for="{ game, count } in leastPlayedGames" :key="game?.id" class="flex items-center justify-between p-2 bg-zinc-900/60 rounded">
            <span>{{ game?.name }}</span>
            <span class="font-bold">{{ count }} volte</span>
          </div>
        </div>
      </div>

      <!-- Top Rated Games -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Giochi più votati</h2>
        <div class="h-64 bg-zinc-900/60 rounded p-2">
            <BarChart :chart-data="topRatedGamesChartData" :chart-options="chartOptions" />
        </div>
      </div>
    </div>
  </section>
</template>
