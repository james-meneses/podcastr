import { createContext, useState, ReactNode } from 'react'
import {useContext} from 'react';

type Podcast = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  podcastList: Podcast[];
  playList: (list: Podcast[], index: number) => void;
  currentPodcastIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  toggleLoop: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  play: (podcast: Podcast) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider ({children}: PlayerContextProviderProps) {
  const [podcastList, setPodcastList] = useState([]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play (podcast) {
      setPodcastList([podcast]);
      setCurrentPodcastIndex(0);
      setIsPlaying(true);
  }

  //receives the podcastList and plays the requested (index number) element 
  function playList(list: Podcast[], index: number) {
    console.log('index => ', index, 'list => ', list)
    setPodcastList(list);
    setCurrentPodcastIndex(index);
    setIsPlaying(true);
  }

  function togglePlay () { 
    setIsPlaying(!isPlaying);
  }

  function toggleLoop () {
    setIsLooping(!isLooping);
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state);
  }
  
  function toggleShuffle () {
    setIsShuffling(!isShuffling);
  }

  const hasNext = isShuffling || (currentPodcastIndex + 1) < podcastList.length;
  const hasPrevious = currentPodcastIndex > 0; 

  function playNext () {
    if (isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * podcastList.length)
        setCurrentPodcastIndex(nextRandomEpisodeIndex)
    } else if (isLooping) {
        setCurrentPodcastIndex(currentPodcastIndex)
    } else if (hasNext)
      setCurrentPodcastIndex(currentPodcastIndex + 1)
  }

  function playPrevious () {
    if(hasPrevious)
        setCurrentPodcastIndex(currentPodcastIndex - 1)
  }

  function clearPlayerState () {
    setPodcastList([])
    setCurrentPodcastIndex(0)
  }

  return (
    <PlayerContext.Provider value={{ podcastList, currentPodcastIndex, play, isPlaying, isLooping, toggleLoop, togglePlay, setPlayingState, playList, playNext, playPrevious, hasNext, hasPrevious, isShuffling, toggleShuffle, clearPlayerState}}>
      {children}
    </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}