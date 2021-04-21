import styles from './styles.module.scss';

export function Player () {	
	return (
		<div className={styles.playerContainer}>
			<header>
				<img src="/playing.svg" alt="Tocando.." />
				<strong>Tocando..</strong>
			</header>

			<div className={styles.emptyPlayer}>
				<strong>Selecione um podcast para tocar</strong>
			</div>

			<footer></footer>

		</div>
	)
}