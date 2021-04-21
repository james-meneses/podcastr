import '../styles/global.scss'

import {Header} from '../components/Header/index.tsx'
import {Player} from '../components/Player/index.tsx'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  return (
  	<div className={styles.wrapper}>
  		<main>
	  		<Header></Header>
	  		<Component {...pageProps} />
  		</main>
	  	<Player></Player>
  	</div>
  )
}

export default MyApp
