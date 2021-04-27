import { NowRequest, NowResponse } from "@vercel/node";
import podcasts from '../../../db.json'

export default (req: NowRequest, res: NowResponse) => {
  const episodes = podcasts.episodes
  return res.json(episodes);
};