'use client';

import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Compatibility layer for react-router-dom

// Link component compatible with react-router-dom
export const Link = React.forwardRef<
  HTMLAnchorElement,
  { to: string; children: React.ReactNode; className?: string; [key: string]: any }
>(({ to, children, ...props }, ref) => {
  return (
    <NextLink href={to} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

// useNavigate hook
export function useNavigate() {
  const router = useNextRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      } else {
        // For other numbers, just go back
        router.back();
      }
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
}

// useLocation hook - client-side only to avoid SSR issues
export function useLocation() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Only access window on client side
    if (typeof window !== 'undefined') {
      setSearch(window.location.search);
      setHash(window.location.hash);
    }
  }, [pathname]);

  return {
    pathname,
    search,
    hash,
    state: null,
    key: 'default',
  };
}

// useParams hook - re-export from next/navigation
export { useParams };

// useSearchParams hook - client-side implementation that doesn't require Suspense
export function useSearchParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return searchParams;
}

// useSearchParams hook - with compatibility
export function useSearchParamsCompat() {
  const searchParams = useSearchParams();
  return {
    get: (key: string) => searchParams?.get(key) ?? null,
    getAll: (key: string) => searchParams?.getAll(key) ?? [],
    has: (key: string) => searchParams?.has(key) ?? false,
    toString: () => searchParams?.toString() || '',
  };
}

// Navigate component
export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useNextRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
}

// Outlet placeholder - children are passed through layout
export function Outlet() {
  return null; // In Next.js App Router, children are handled by layout
}

// BrowserRouter - no-op in Next.js
export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Routes - no-op in Next.js
export function Routes({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Route - no-op in Next.js
export function Route({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
