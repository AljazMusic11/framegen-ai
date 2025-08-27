export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';

export default function SignUpPage({ searchParams }: { searchParams?: { [k: string]: string } }) {
  return (
    <Suspense>
      <Login mode="signup" searchParams={searchParams as any} />
    </Suspense>
  );
}
