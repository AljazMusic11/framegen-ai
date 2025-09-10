'use client';

export function ClientShell({
  onSignOut,
  children,
}: {
  onSignOut: (formData: FormData) => Promise<any>;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="p-4 border-b flex items-center justify-between">
        <div className="font-medium">Dashboard</div>
        <form action={onSignOut}>
          <button type="submit" className="text-sm underline">
            Sign out
          </button>
        </form>
      </header>
      <main>{children}</main>
    </>
  );
}