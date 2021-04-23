import '../styles/global.scss'

import {useState} from 'react'

import {Header} from '../components/Header'
import {Player} from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);

  function play (podcast) {
      
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentPodcastIndex }}>
  	<div className={styles.wrapper}>
  		<main>
	  		<Header></Header>
	  		<Component {...pageProps} />
  		</main>
	  	<Player></Player>
  	</div>
    </PlayerContext.Provider>
  )
}

export default MyApp
