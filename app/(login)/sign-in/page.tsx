export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';
import { signIn } from '../actions';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;

  return (
    <Suspense>
      <Login mode="signin" searchParams={sp as any} action={signIn} />
    </Suspense>
  );
}
