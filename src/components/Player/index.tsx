import {useContext} from 'react';

import styles from './styles.module.scss';
import Image from 'next/image'

import {PlayerContext} from '../../contexts/PlayerContext';

export function Player () {	
	// get the list of episodes and the current item
	// typo define at the playerContext config
	const {podcastList, currentPodcastIndex} = useContext(PlayerContext);
	const podcast = podcastList[currentPodcastIndex];

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
							<div className={styles.emptySlider}></div>
					</div>
					<span>00:00</span>
				</div>

				<div className={styles.buttons}>
					<button type="button">
						<img src="/shuffle.svg" alt="Reordenar" />
					</button>
					<button type="button">
					  <img src="/play-previous.svg" alt="Tocar Anterior" />
					</button>
					<button type="button" className={styles.playButton}>
						<img src="/play.svg" alt="Tocar" />
					</button>
					<button type="button">
						<img src="/play-next.svg" alt="Tocar Próximo" />
					</button>
					<button type="button">
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>

			</footer>

		</div>
	)
}