/**
 * app/generate/page.tsx
 * Server page with a minimal client script to call /api/generate and render the result.
 * Auth required. Mobile-first UI with sticky action bar.
 */
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GeneratePage() {
  const user = await getUser().catch(() => null);
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-xl p-4 pb-28">
      <h1 className="text-2xl font-semibold mb-3">Generate a Video</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Describe a video, which you want to create. Short and clear instructions. (ex.: &quot;neon city at night, 9:16, cinematic&quot;).
      </p>

      <form id="gen-form" className="space-y-3" aria-describedby="progress">
        <textarea
          name="prompt"
          rows={5}
          placeholder="A slow zoom on neon city streets at night, cinematic, 9:16"
          className="w-full rounded-lg border p-3 outline-none"
          required
          maxLength={600}
        />

        <input
          name="imageUrl"
          type="url"
          className="w-full rounded-lg border p-3"
          placeholder="https://…/your-image.jpg (optional)"
        />

        <select name="model" className="w-full rounded-lg border p-3" defaultValue="mock">
          <option value="mock">Mock (demo)</option>
          <option value="replicate-pika">Replicate • Pika</option>
          <option value="replicate-svd">Replicate • Stable Video</option>
        </select>
      </form>

      {/* result */}
      <div id="result" className="mt-5 hidden" aria-live="polite">
        <h2 className="font-medium mb-2">Result</h2>
        <video
          id="player"
          className="w-full rounded-lg"
          controls
          playsInline
          preload="metadata"
        />
        <a id="download" className="block text-sm underline mt-2" href="#" download="video.mp4">
          Download
        </a>
      </div>

      {/* sticky bar */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-white/80 backdrop-blur p-3">
        <div className="mx-auto max-w-xl flex gap-3">
          <button
            id="generate"
            form="gen-form"
            className="flex-1 rounded-lg bg-black text-white py-3 font-medium disabled:opacity-60"
            type="button"
            aria-busy="false"
          >
            Generate
          </button>
          <button
            id="clear"
            className="rounded-lg border px-4"
            type="button"
          >
            Clear
          </button>
        </div>
        <div id="progress" className="mx-auto max-w-xl text-sm mt-2 h-5" aria-live="polite"></div>
      </div>

      {/* Inline client script (small, no frameworks). Keeps page server-rendered. */}
      <script
        dangerouslySetInnerHTML={{
          __html: String.raw`
(function(){
  const genBtn = document.getElementById('generate');
  const clearBtn = document.getElementById('clear');
  const form = document.getElementById('gen-form');
  const progress = document.getElementById('progress');
  const result = document.getElementById('result');
  const player = document.getElementById('player');
  const download = document.getElementById('download');

  function setProgress(text){ if(progress) progress.textContent = text || ''; }
  function setBusy(on){
    if(!genBtn) return;
    genBtn.disabled = !!on;
    genBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    genBtn.textContent = on ? 'Generating…' : 'Generate';
  }
  function showResult(url){
    if(!url) return;
    if(player) player.src = url;

    // Force a real download via same-origin proxy:
    const proxied = '/api/download?url=' + encodeURIComponent(url) + '&name=video.mp4';
    if(download){
      download.href = proxied;
      download.setAttribute('download', 'video.mp4'); // optional, but fine
    }

    if(result) result.classList.remove('hidden');
  }
  function clearAll(){
    if(form) form.reset();
    if(player) player.removeAttribute('src');
    if(download) download.removeAttribute('href');
    if(result) result.classList.add('hidden');
    setProgress('');
  }

  if(clearBtn) clearBtn.addEventListener('click', clearAll);

  if(genBtn) genBtn.addEventListener('click', async ()=>{
    if(!form) return;
    const data = new FormData(form);
    const prompt = data.get('prompt');
    const model = data.get('model');
    const imageUrl = data.get('imageUrl') || '';
    if(!prompt){ return; }

    setBusy(true); setProgress('Submitting…');
    
    if (model === 'replicate-svd' && !imageUrl) 
    { setProgress('Please add an image URL for SVD.'); 
    return;
    }

    try{
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify({ prompt, model, imageUrl }), // include imageUrl
        cache: 'no-store',
      });
      if(!res.ok){
        const msg = await res.text().catch(()=> 'Request failed');
        throw new Error(msg || 'Request failed');
      }
      const json = await res.json();

      // Mock returns final URL immediately
      if((json && json.status === 'completed') && json.url){
        showResult(json.url);
        setProgress('Done.');
      } else {
        // If later you switch to async jobs (e.g., Replicate), you may poll here using json.jobId.
        setProgress('Queued. Please check My Videos shortly.');
      }
    }catch(e){
      console.error(e);
      setProgress('Error. Please try again.');
    }finally{
      setBusy(false);
    }
  });
})();
`}}
      />
    </div>
  );
}