// app/api/download/route.ts
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url  = searchParams.get('url');
  const name = (searchParams.get('name') || 'video.mp4').replace(/[^a-z0-9._-]/gi, '_');

  if (!url) return new Response('Missing url', { status: 400 });

  // Fetch the upstream file without caching
  const upstream = await fetch(url, { cache: 'no-store' });
  if (!upstream.ok || !upstream.body) {
    return new Response(`Upstream error (${upstream.status})`, { status: upstream.status });
  }

  const contentType =
    upstream.headers.get('content-type') || 'application/octet-stream';

  // Stream through with attachment headers
  return new Response(upstream.body, {
    headers: {
      'content-type': contentType,
      'content-disposition': `attachment; filename="${name}"`,
      'cache-control': 'private, no-store',
    },
  });
}