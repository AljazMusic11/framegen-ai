// app/(dashboard)/dashboard/general/page.tsx
import { updateAccount } from '@/app/(login)/actions';
import { getUser } from '@/lib/db/queries';

export default async function GeneralSettingsPage() {
  const user = await getUser().catch(() => null);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Account</h1>

      <form action={updateAccount} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={(user as any)?.name ?? ''}
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={(user as any)?.email ?? ''}
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        <button type="submit" className="rounded bg-black text-white px-4 py-2">
          Save changes
        </button>
      </form>
    </div>
  );
}