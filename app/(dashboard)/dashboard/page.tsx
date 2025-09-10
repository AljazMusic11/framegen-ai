import { inviteTeamMember, removeTeamMember } from '@/app/(login)/actions';

export default async function DashboardHome() {
  // wrappers for validated actions
  async function onInvite(formData: FormData) {
    'use server';
    return inviteTeamMember({}, formData);
  }

  async function onRemove(formData: FormData) {
    'use server';
    return removeTeamMember({}, formData);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 p-6">
      <h1 className="text-2xl font-semibold">Team</h1>

      {/* Invite member */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Invite team member</h2>
        <form action={onInvite} className="space-y-3 max-w-sm">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="teammate@email.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select name="role" className="w-full border rounded px-3 py-2">
              <option value="member">Member</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <button type="submit" className="rounded bg-black text-white px-4 py-2">
            Send invite
          </button>
        </form>
      </section>

      {/* Remove member (by memberId) */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Remove team member</h2>
        <form action={onRemove} className="space-y-3 max-w-sm">
          <div>
            <label className="block text-sm mb-1">Member ID</label>
            <input
              name="memberId"
              type="number"
              min={1}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="123"
            />
          </div>
          <button type="submit" className="rounded bg-red-600 text-white px-4 py-2">
            Remove
          </button>
        </form>
      </section>
    </div>
  );
}