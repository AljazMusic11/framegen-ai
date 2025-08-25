export const runtime = 'nodejs';

export async function GET() {
  const a = process.env.AUTH_SECRET || '';
  const n = process.env.NEXTAUTH_SECRET || '';
  const j = process.env.JWT_SECRET || '';
  return new Response(
    JSON.stringify({
      AUTH_SECRET_len: a.length,
      NEXTAUTH_SECRET_len: n.length,
      JWT_SECRET_len: j.length,
    }),
    { headers: { 'content-type': 'application/json' } }
  );
}