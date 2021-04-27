import { NowRequest, NowResponse } from "@vercel/node";
import db from '../../../../db.json'

export default (req: NowRequest, res: NowResponse) => {
  const data = db;

  const episodes = data.episodes;
  const slug = req.query.slug;

  const requestedEpisode = episodes.filter(episode => episode.id == slug )
  console.log ('data => ', requestedEpisode, slug)

  return res.json(requestedEpisode[0]);
};