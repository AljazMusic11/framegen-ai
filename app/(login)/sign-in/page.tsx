export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';

export default function SignInPage({ searchParams }: { searchParams?: { [k: string]: string } }) {
  return (
    <Suspense>
      <Login mode="signin" searchParams={searchParams as any} />
    </Suspense>
  );
}
