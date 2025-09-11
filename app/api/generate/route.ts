// app/api/generate/route.ts
export const runtime = "nodejs";

type Body = { prompt?: string; model?: string };

export async function POST(req: Request) {
  const { prompt, model }: Body = await req.json().catch(() => ({}));
  if (!prompt) return Response.json({ error: "Missing prompt" }, { status: 400 });

  // TODO: add auth & credit checks here using your existing session/user

  // MOCK: return a public sample clip (9:16). Replace with your own later.
  const sample =
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"; // any public mp4/webm URL works

  // Structure matches what a real provider would send back later.
  return Response.json({
    status: "completed",
    provider: model ?? "mock",
    url: sample,
    jobId: "mock-" + Date.now(),
    prompt,
  });
}
