import {GetStaticProps} from 'next';
import {api} from '../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { usePlayer } from '../contexts/PlayerContext'

import styles from './home.module.scss'


type Podcast = {
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
  latestPodcasts: Podcast[],
  allPodcasts   : Podcast[]  
}

export default function Home({latestPodcasts, allPodcasts}: HomeProps) {

  const {play, playList} = usePlayer();

  const podcastList = [...latestPodcasts,...allPodcasts]
 
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Podcastr | Os Melhores Podcasts de Tecnologia</title>

        <meta name="description" content="O Podcastr traz os melhores podcasts de tecnologia para você. Fique atualizado ouvindo os grandes especialistas de TI." key="meta-description" />
        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:url" content="https://podcastr-lac.vercel.app/" key="og-url" />
        <meta property="og:title" content="Podcastr | Os Melhores Podcasts de Tecnologia" key="og-title" />
        <meta property="og:image" content="/podcastr-home.png" key="og-image" />

        <meta property="twitter:card" content="/podcastr-home.png" key="tt-image" />
        <meta property="twitter:url" content="https://podcastr-lac.vercel.app/" key="tt-url" />
        <meta property="twitter:title" content="Podcastr | Os Melhores Podcasts de Tecnologia" key="tt-title" />
        <meta property="twitter:description" content="O Podcastr traz os melhores podcasts de tecnologia para você. Fique atualizado ouvindo os grandes especialistas de TI." key="tt-description" />
        <meta property="twitter:image" content="/podcastr-home.png" key="tt-image" />


      </Head>

      <section className={styles.latestPodcasts}>
        <h2>Últimos Lançamentos</h2>
        <ul>
        {
          latestPodcasts.map((podcast, index) => {
            return (
              <li key={podcast.id} className={styles.featuredpodcast}>
                
                <Image width={192} height={192} src={podcast.thumbnail}
                       alt={podcast.title} objectFit="cover" />

                <div className={styles.podcastDetails}>
                  <Link href={`/podcasts/${podcast.id}`}>
                    <a className={styles.podcastLink}>
                      {podcast.title}
                    </a>
                  </Link>
                  <p>{podcast.members}</p>

                  <span>{podcast.publishedAt}</span>
                  <span>{podcast.durationAsString}</span>

                </div> 
                
                <button type="button" onClick={() => playList(podcastList, index)}>
                  <img src="/play-green.svg" alt="Tocar podcast" />
                </button>
              </li>
              )
          })
        }
        </ul>
      </section>

    <section className={styles.allPodcasts}>
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
          { allPodcasts.map( (podcast, index) => {
              return (
                <tr key={podcast.id} >
                  <td style={{width:80}}>
                    <Image width={120}
                      height={120} src={podcast.thumbnail}
                      alt={podcast.title} objectFit="cover" />
                  </td>
                  <td> 
                    <Link href={`/podcasts/${podcast.id}`}>
                    <a>{podcast.title}</a> 
                    </Link> 
                  </td>
                  <td> {podcast.members} </td>
                  <td style={{ width: 100 }}> {podcast.publishedAt} </td>
                  <td> {podcast.durationAsString} </td>
                  <td><button type="button" onClick={() => playList(podcastList, index + latestPodcasts.length )}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button></td>

                 </tr>
                )
          }) }
        </tbody>
      </table>

    </section>

    <p style={{'padding':'25px','display': 'none'}}>{JSON.stringify(allPodcasts)}</p>
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

  const podcasts = data.map (podcast => {
    return { 
      id: podcast.id,
      title: podcast.title,
      members: podcast.members,
      publishedAt: format(parseISO(podcast.published_at), 'd MMM yy', {locale: ptBR}), 
      thumbnail: podcast.thumbnail,
      duration: Number(podcast.file.duration),
      durationAsString: convertDurationToTimeString(Number(podcast.file.duration)), 
      url: podcast.file.url
    }})

  const latestPodcasts = podcasts.slice(0,2)
  const allPodcasts    = podcasts.slice(2, podcasts.length)

  return {
    props: {
      latestPodcasts,
      allPodcasts,
    },
    revalidate: 60
  }
}