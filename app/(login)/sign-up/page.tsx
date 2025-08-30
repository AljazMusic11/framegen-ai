export const runtime = 'nodejs';

import { Suspense } from 'react';
import { Login } from '../login';
import { signUp } from '../actions';

export default function SignUpPage({ searchParams }: { searchParams?: Record<string, string> }) {
  return (
    <Suspense>
      <Login
        mode="signup"
        searchParams={searchParams as any}
        action={signUp}   // pass server action down
      />
    </Suspense>
  );
}
