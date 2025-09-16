// app/api/generate/route.ts
export const runtime = "nodejs";

type Body = {
  prompt?: string;
  model?: string;        // "mock" | "replicate-svd"
  imageUrl?: string;     // optional image for SVD
};

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || "";
const SVD_VERSION = process.env.REPLICATE_SVD_VERSION || "";

export async function POST(req: Request) {
  const { prompt, model, imageUrl }: Body = await req.json().catch(() => ({}));

  if (!prompt) {
    return Response.json({ error: "Missing prompt" }, { status: 400 });
  }

  // --- MOCK (default) ---
  if (!model || model === "mock") {
    const sample = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    return Response.json({
      status: "completed",
      provider: "mock",
      url: sample,
      jobId: "mock-" + Date.now(),
      prompt,
    });
  }

  // --- Replicate SVD: image + text -> video ---
  if (model === "replicate-svd") {
    if (!REPLICATE_TOKEN || !SVD_VERSION) {
      return Response.json(
        { error: "Server missing REPLICATE_API_TOKEN or REPLICATE_SVD_VERSION" },
        { status: 500 }
      );
    }

    const inputImage =
      imageUrl ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Cornell_box.png/320px-Cornell_box.png";

    // 1. Create prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: SVD_VERSION,
        input: { prompt, image: inputImage },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return Response.json({ error: "Failed to create Replicate job", details: errText }, { status: 500 });
    }

    const prediction = await createRes.json();
    const jobId = prediction.id;

    // 2. Poll until completed (simplified demo; real app should use webhook)
    let url: string | null = null;
    for (let i = 0; i < 20; i++) {
      const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
      });
      const statusJson = await statusRes.json();
      if (statusJson.status === "succeeded" && statusJson.output?.[0]) {
        url = statusJson.output[0];
        break;
      }
      if (statusJson.status === "failed") {
        return Response.json({ error: "Replicate job failed" }, { status: 500 });
      }
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s between polls
    }

    if (!url) {
      return Response.json({ error: "Timed out waiting for video" }, { status: 504 });
    }

    return Response.json({
      status: "completed",
      provider: "replicate-svd",
      url,
      jobId,
      prompt,
      imageUrl: inputImage,
    });
  }

  return Response.json({ error: "Unknown model" }, { status: 400 });
}