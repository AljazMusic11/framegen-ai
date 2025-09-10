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

  // inline server action wrapper
  async function onSignUp(formData: FormData) {
    'use server';
    return signUp({}, formData);
  }

  return (
    <Suspense>
      <Login mode="signup" searchParams={sp as any} action={onSignUp} />
    </Suspense>
  );
}