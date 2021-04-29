import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {useRouter} from 'next/router';
import {GetStaticProps, GetStaticPaths} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { usePlayer } from '../../contexts/PlayerContext'

import {api} from '../../services/api'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'

import styles from './podcast.module.scss'

type Podcast = {
  id: string;
  title: string;
  members: string;
  duration: number;
  durationAsString: string;
  thumbnail: string;
  url: string;
  description: string;
  publishedAt: string;
}


type PodcastProps = {
  podcast: Podcast;
}

export default function Podcast ({podcast}: PodcastProps) {
    if(podcast === undefined) 
      return null;
    
    const {play} = usePlayer();


    return (
      <div className={styles.podcastContainer}>
      <div className={styles.podcast}>
    <Head>
      <title key="meta-title">{ podcast.title || 'Podcastr | Os Melhores Podcasts de Tecnologia' }</title>
      <meta name="description" content={podcast.description.slice(0, 170)} key="meta-description" />

        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:url" content={`https://podcastr-lac.vercel.app/podcasts/${podcast.id}`} key="og-url" />
        <meta property="og:title" content={ podcast.title || 'Podcastr | Os Melhores Podcasts de Tecnologia'} key="og-title" />
        <meta property="og:image" content={podcast.thumbnail || '/podcastr-home.png'} key="og-image" />

        <meta property="twitter:card" content={podcast.thumbnail || '/podcastr-home.png'} key="tt-image" />
        <meta property="twitter:url" content="https://podcastr-lac.vercel.app/podcasts/" key="tt-url" />
        <meta property="twitter:title" content={ podcast.title || 'Podcastr | Os Melhores Podcasts de Tecnologia'} key="tt-title" />
        <meta property="twitter:description" content={podcast.description.slice(0, 170) || "O Podcastr traz os melhores podcasts de tecnologia para você. Fique atualizado ouvindo os grandes especialistas de TI." } key="tt-description" />
        <meta property="twitter:image" content={podcast.thumbnail || '/podcastr-home.png'} key="tt-image" />


    </Head>
        <div className={styles.thumbnailContainer} >
          <Link href="/">  
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            className={styles.thumbnail}
            width={700}
            height={320}
            src={podcast.thumbnail}
            objectFit="cover"
           />


           <button type="button" onClick={() => play(podcast)}>
             <img src="/play.svg" alt="Tocar podcast" />
           </button>
        </div>

         <header>
           <h1>{podcast.title}</h1>
           <span>{podcast.members}</span>
           <span>{podcast.publishedAt}</span>
           <span>{podcast.durationAsString}</span>
         </header>

         <div className={styles.description}
              dangerouslySetInnerHTML={{ __html: podcast.description }} />

      </div> 
      </div> 
    )
}

// Generate the static paths that are gonna be available
// on production
// we call it dynamic SSG
export const getStaticPaths: GetStaticPaths = async () => {
  
  // First we get the data that are gonna be prefetched
  // in this case, our 2 last podcast are gonna be available
  // upfront
  const {data} = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort : 'published_at',
      _order: 'Desc'
    }
  })

  // Here we set the paths generated on build
  const paths = data.map(podcast => {
    return {
      params: {
        slug: podcast.id
      }
    }
  })

  // Then, we simply return paths and set fallback wich can be:
  // false => returns 404 for pages not generated on build
  // true => not generated pages on build, are generated on client-side
  // blocking => same as above, but page is shown only after loaded/rendered
  // this last one is better for SEO :)
  return {
    paths,
    fallback: 'blocking'
  }  
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params
    console.log('slug => ', slug)
    if(slug.indexOf('.svg') !== -1) {
      return {
        props: {},
        revalidate: 60 * 60 * 24, // 24h
      }
    }


    const { data } = await api.get(`/episodes/${slug}`)
    
    const podcast = {
      id: data.id,
      title: data.title,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}), 
      thumbnail: data.thumbnail,
      description: data.description,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)), 
      url: data.file.url
    }

    return {
      props: {
        podcast,
      },
      revalidate: 60 * 60 * 24, // 24h
    }
}