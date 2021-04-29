import {useRef, useEffect, useState} from 'react';
import Image from 'next/image'
import Head from 'next/head';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';

import {usePlayer} from '../../contexts/PlayerContext';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'

export function Player () {	

  //Handle the <audio> play/pause using react 
  //all HTML elements are global (on react, at least)
  //and all of them receive a ref attribute we can use for handling behavior
  const audioRef = useRef<HTMLAudioElement>(null)

	// get the list of episodes and the current item
	// typo define at the playerContext config
	const {podcastList, currentPodcastIndex, 
        isPlaying, togglePlay, setPlayingState,
        playNext, playPrevious, hasNext, hasPrevious,
        isLooping, toggleLoop, isShuffling, toggleShuffle, clearPlayerState } = usePlayer();

	const podcast = podcastList[currentPodcastIndex];

  const [progress, setProgress] = useState(0);

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

  function setupProgressListener(){
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    } )
  }

  function handleSeek (amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handlePodcastEnded () {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    } 
  }

	return (
		<div className={podcast ? [styles.playerContainer, styles.playing].join(' ') : styles.playerContainer}>
    <Head>
      <title>{podcast ? `Tocando ${podcast.title}` : 'Podcastr | Os Melhores Podcasts de Tecnologia'}</title>
      <meta name="description" content="O Podcastr traz os melhores podcasts de tecnologia para você. Fique atualizado ouvindo os grandes especialistas de TI."/>
    </Head>
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
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
							{ podcast ? (
                <Slider max={podcast.duration}
                        value={progress}
                        onChange={handleSeek}
                        trackStyle={{backgroundColor:'#04d361'}} 
                        railStyle={{backgroundColor:'#9f75ff'}}
                        handleStyle={{borderColor:'#04d361', borderWidth: 4}}
                />
              ) : (
                <div className={styles.emptySlider}></div>
              ) }
					</div>
          <span>{
            convertDurationToTimeString(podcast?.duration ?? 0)
          }</span>
				</div>

        { podcast && (
            <audio src={podcast.url} 
                    ref={audioRef}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onEnded={handlePodcastEnded}
                    loop={isLooping}
                    onLoadedMetadata={()=>setupProgressListener()}
                    autoPlay/>

          )}

				<div className={styles.buttons}>
					<button type="button"
            onClick={ () => toggleShuffle() }
           disabled={!podcast || podcastList.length === 1}
           className={isShuffling ? styles.isActive : ''}>
						<img src="/shuffle.svg" alt="Tocar Aleatoriamente" title="Tocar aleatoriamente"/>
					</button>
					<button type="button" onClick={() => playPrevious()}
          disabled={!podcast || !hasPrevious}>
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
					<button type="button" onClick={() => playNext()}
              disabled={!podcast || !hasNext}>
						<img src="/play-next.svg" alt="Tocar Próximo" />
					</button>
					<button type="button" onClick={() => toggleLoop()}
            className={isLooping ? styles.isActive : ''}
           disabled={!podcast}>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>

			</footer>

		</div>
	)
}