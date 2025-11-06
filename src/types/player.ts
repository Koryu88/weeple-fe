export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  avatarUrl?: string;
}

