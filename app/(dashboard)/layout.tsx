import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { getUser } from '@/lib/db/queries';
import type { User } from '@/lib/db/schema';

// Server component: no "use client", no client hooks here.

function initialsFromEmail(email?: string | null) {
  if (!email) return 'U';
  return email
    .split('@')[0]
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || 'U';
}

async function UserMenu() {
  const user = (await getUser().catch(() => null)) as User | null;

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>{initialsFromEmail(user.email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        {/* Use a server action via form submission; no client router needed */}
        <form action={signOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function Header() {
  // This is a server component header; it can render client components like DropdownMenu/Avatar,
  // but it must not use client hooks itself.
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">ACME</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* UserMenu is async server component that renders client UI inside */}
          {/** @ts-expect-error Async Server Component */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      {/** @ts-expect-error Async Server Component */}
      <Header />
      {children}
    </section>
  );
}
