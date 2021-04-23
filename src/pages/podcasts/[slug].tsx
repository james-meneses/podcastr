import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {useRouter} from 'next/router';
import {GetStaticProps, GetStaticPaths} from 'next';
import Image from 'next/image';

import {api} from '../../services/api'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString.ts'

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
    return (
      <div className={styles.podcast}>
        <div className={styles.thumbnailContainer} >
          <button type="button">
            <Image width={32} height={32} src="/arrow-left.svg" alt="Voltar" />
          </button>
        </div>
      </div>  
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params

    if(slug.indexOf('.svg') !== -1) {
      return {
        props: {},
        revalidate: 60 * 60 * 24, // 24h
      }
    }

    console.log('slug', slug)

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