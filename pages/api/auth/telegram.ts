import { NextApiRequest, NextApiResponse } from 'next';

export default function telegramAuthCallback(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query, req.body);
  res.redirect(307, '/');
}
