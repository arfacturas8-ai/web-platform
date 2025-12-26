'use client';

import dynamic from 'next/dynamic';

const AdminLayout = dynamic(
  () => import('@/components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })),
  { ssr: false }
);

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
