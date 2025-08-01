
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(`User-agent: *
Disallow: /api/
Disallow: /admin/
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`)
}
