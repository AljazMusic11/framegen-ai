import { updatePassword, deleteAccount } from '@/app/(login)/actions';

export default async function SecurityPage() {
  // wrappers for validated actions
  async function onUpdatePassword(formData: FormData) {
    'use server';
    return updatePassword({}, formData);
  }

  async function onDeleteAccount(formData: FormData) {
    'use server';
    return deleteAccount({}, formData);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Security</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Change password</h2>
        <form action={onUpdatePassword} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Current password</label>
            <input
              name="currentPassword"
              type="password"
              required
              minLength={8}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New password</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm new password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded bg-black text-white px-4 py-2">
            Update password
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium text-red-700">Delete account</h2>
        <p className="text-sm text-gray-600">This action is permanent.</p>
        <form action={onDeleteAccount} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Confirm with password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded bg-red-600 text-white px-4 py-2">
            Delete account
          </button>
        </form>
      </section>
    </div>
  );
}