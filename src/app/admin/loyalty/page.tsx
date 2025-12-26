'use client';
import dynamic from 'next/dynamic';
const AdminLoyalty = dynamic(() => import('@/views/admin/AdminLoyalty'), { ssr: false });
export default function AdminLoyaltyPage() { return <AdminLoyalty />; }
