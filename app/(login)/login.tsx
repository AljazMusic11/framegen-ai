export const runtime = 'nodejs';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon } from 'lucide-react';

type LoginProps = {
  mode?: 'signin' | 'signup';
  searchParams?: {
    redirect?: string;
    priceId?: string;
    inviteId?: string;
    error?: string;
  };
  // accept the server action as a prop from the page
  action: (formData: FormData) => Promise<any>;
};

export function Login({ mode = 'signin', searchParams, action }: LoginProps) {
  const redirect = searchParams?.redirect ?? '';
  const priceId  = searchParams?.priceId  ?? '';
  const inviteId = searchParams?.inviteId ?? '';
  const error    = searchParams?.error    ?? '';

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" action={action}>
          <input type="hidden" name="redirect" value={redirect} />
          <input type="hidden" name="priceId"  value={priceId} />
          <input type="hidden" name="inviteId" value={inviteId} />

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
            <div className="mt-1">
              <Input id="email" name="email" type="email" autoComplete="email" required maxLength={50} />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                maxLength={100}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full rounded-full bg-orange-600 text-white py-2">
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${redirect ? `?redirect=${redirect}` : ''}${priceId ? `${redirect ? '&' : '?'}priceId=${priceId}` : ''}`}
            className="inline-block px-4 py-2 border rounded-full"
          >
            {mode === 'signin' ? 'Create an account' : 'Sign in to existing account'}
          </Link>
        </div>
      </div>
    </div>
  );
}
