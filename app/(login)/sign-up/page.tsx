export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';
import { signUp } from '../actions';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;

  return (
    <Suspense>
      <Login mode="signup" searchParams={sp as any} action={signUp} />
    </Suspense>
  );
}
