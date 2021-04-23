import {GetStaticProps} from 'next';
import {api} from '../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  members: string;
  duration: number;
  durationAsString: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes   : Episode[]  
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
        {
          latestEpisodes.map(episode => {
            return (
              <li key={episode.id} className={styles.featuredEpisode}>
                
                <Image width={192} height={192} src={episode.thumbnail}
                       alt={episode.title} objectFit="cover" />

                <div className={styles.episodeDetails}>
                  <Link href={`/podcasts/${episode.id}`}>
                    <a className={styles.episodeLink}>
                      {episode.title}
                    </a>
                  </Link>
                  <p>{episode.members}</p>

                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>

                </div> 
                
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
              )
          })
        }
        </ul>
      </section>

    <section className={styles.allEpisodes}>
      <h2>Todos os Episódios</h2>
      
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { allEpisodes.map( episode => {
              return (
                <tr key={episode.id} >
                  <td style={{width:80}}>
                    <Image width={120}
                      height={120} src={episode.thumbnail}
                      alt={episode.title} objectFit="cover" />
                  </td>
                  <td> 
                    <Link href={`/podcasts/${episode.id}`}>
                    <a>{episode.title}</a> 
                    </Link> 
                  </td>
                  <td> {episode.members} </td>
                  <td style={{ width: 100 }}> {episode.publishedAt} </td>
                  <td> {episode.durationAsString} </td>
                  <td><button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button></td>

                 </tr>
                )
          }) }
        </tbody>
      </table>

    </section>

    <p style={{'padding':'25px','display': 'none'}}>{JSON.stringify(allEpisodes)}</p>
    </div>
    ) 
}

export const getStaticProps: GetStaticProps = async () =>  {
  const {data} = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map (episode => {
    return { 
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}), 
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)), 
      url: episode.file.url
    }})

  const latestEpisodes = episodes.splice(0,2)
  const allEpisodes    = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60
  }
}