// app/generate/page.tsx
import { getUser } from "@/lib/db/queries"; // already in your repo
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const runtime = "nodejs";

export default async function GeneratePage() {
  const user = await getUser().catch(() => null);
  if (!user) redirect("/sign-in");

  return (
    <Suspense>
      <div className="mx-auto max-w-xl p-4 pb-28">
        <h1 className="text-2xl font-semibold mb-3">Generate a Video</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Describe the video you want. Keep it short and specific.
        </p>

        <form id="gen-form" className="space-y-3">
          <textarea
            name="prompt"
            rows={5}
            placeholder="A slow zoom on neon city streets at night, cinematic, 9:16"
            className="w-full rounded-lg border p-3 outline-none"
            required
          />
          <select name="model" className="w-full rounded-lg border p-3">
            <option value="mock">Mock (demo)</option>
            <option value="replicate-pika">Replicate • Pika</option>
            <option value="replicate-svd">Replicate • Stable Video</option>
          </select>
        </form>

        {/* result */}
        <div id="result" className="mt-5 hidden">
          <h2 className="font-medium mb-2">Result</h2>
          <video id="player" className="w-full rounded-lg" controls playsInline />
          <a id="download" className="block text-sm underline mt-2" href="#" download>
            Download MP4
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
          <div id="progress" className="mx-auto max-w-xl text-sm mt-2"></div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  const genBtn = document.getElementById('generate');
  const clearBtn = document.getElementById('clear');
  const form = document.getElementById('gen-form');
  const progress = document.getElementById('progress');
  const result = document.getElementById('result');
  const player = document.getElementById('player');
  const download = document.getElementById('download');

  function setProgress(text){ progress.textContent = text || ''; }
  function setBusy(on){ genBtn.disabled = on; }

  clearBtn.addEventListener('click', ()=>{
    form.reset(); setProgress(''); result.classList.add('hidden');
  });

  genBtn.addEventListener('click', async ()=>{
    const data = new FormData(form);
    const prompt = data.get('prompt');
    const model = data.get('model');
    if(!prompt) return;
    setBusy(true); setProgress('Submitting…');

    try{
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify({ prompt, model })
      });
      if(!res.ok){ throw new Error('Request failed'); }
      const json = await res.json();

      // Mock returns the final URL immediately.
      if(json.status === 'completed' && json.url){
        player.src = json.url;
        download.href = json.url;
        result.classList.remove('hidden');
        setProgress('Done.');
      }else{
        // If you later switch to real jobs, you can poll json.jobId here.
        setProgress('Queued. Check My Videos soon.');
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
    </Suspense>
  );
}
