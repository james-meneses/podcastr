import { createContext } from 'react'

type Podcast = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  podcastList: Podcast[];
  currentPodcastIndex: number;
  isPlaying: boolean;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  play: (podcast: Podcast) => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

