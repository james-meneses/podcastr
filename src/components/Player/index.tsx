import {useContext, useRef, useEffect} from 'react';
import Image from 'next/image'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';

import {PlayerContext} from '../../contexts/PlayerContext';

export function Player () {	

  //Handle the <audio> play/pause using react 
  //all HTML elements are global (on react, at least)
  //and all of them receive a ref attribute we can use for handling behavior
  const audioRef = useRef<HTMLAudioElement>(null)

	// get the list of episodes and the current item
	// typo define at the playerContext config
	const {podcastList, currentPodcastIndex, isPlaying, togglePlay, setPlayingState} = useContext(PlayerContext);
	const podcast = podcastList[currentPodcastIndex];

  useEffect(() => {
    if(!audioRef.current) {
      return
    } 

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

	return (
		<div className={podcast ? [styles.playerContainer, styles.playing].join(' ') : styles.playerContainer}>
			<header>
				<img src="/playing.svg" alt="Tocando.." />
				<strong className={styles.playerTitle}>Tocando:</strong>
			</header>

			{ podcast ? (
        <div className={styles.currentPodcast}>
          <Image width={592} height={592} src={podcast.thumbnail} objectFit="cover" />
          <strong className={styles.podcastTitle}>{podcast.title}</strong>
          <span>{podcast.members}</span>
        </div>
        ) : (
      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para tocar</strong>
      </div>
        )
      }

			<footer className={!podcast ? styles.empty : ''}>

				<div className={styles.progress}>
					<span>00:00</span>
					<div className={styles.slider}>
							{ podcast ? (
                <Slider trackStyle={{backgroundColor:'#04d361'}} 
                        railStyle={{backgroundColor:'#9f75ff'}}
                        handleStyle={{borderColor:'#04d361', borderWidth: 4}}
                />
              ) : (
                <div className={styles.emptySlider}></div>
              ) }
					</div>
					<span>00:00</span>
				</div>

        { podcast && (
            <audio src={podcast.url} 
                    ref={audioRef}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    autoPlay/>

          )}

				<div className={styles.buttons}>
					<button type="button" disabled={!podcast}>
						<img src="/shuffle.svg" alt="Reordenar" />
					</button>
					<button type="button" disabled={!podcast}>
					  <img src="/play-previous.svg" alt="Tocar Anterior" />
					</button>
					<button type="button" onClick={ () => togglePlay()}
          disabled={!podcast}
          className={styles.playButton}>
            { isPlaying ? (
						<img src="/pause.svg" alt="Pausar" />  
              ) : (
            <img src="/play.svg" alt="Tocar" />
              )
            }
					</button>
					<button type="button" disabled={!podcast}>
						<img src="/play-next.svg" alt="Tocar Próximo" />
					</button>
					<button type="button" disabled={!podcast}>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>

			</footer>

		</div>
	)
}