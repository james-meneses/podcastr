import { createContext } from 'react'

type Podcast = {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
}

type PlayerContextData = {
  PodcastList: Podcast[];
  currentPodcastIndex: number;
}


export const PlayerContext = createContext({} as PlayerContextData)