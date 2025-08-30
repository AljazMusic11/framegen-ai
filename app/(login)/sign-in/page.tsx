export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';
import { signIn } from '../actions';

export default function SignInPage({ searchParams }: { searchParams?: Record<string, string> }) {
  return (
    <Suspense>
      <Login
        mode="signin"
        searchParams={searchParams as any}
        action={signIn}   // pass server action down
      />
    </Suspense>
  );
}
