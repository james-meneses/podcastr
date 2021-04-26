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
  play: (podcast: Podcast) => void;
}


export const PlayerContext = createContext({} as PlayerContextData)