'use client';
import dynamic from 'next/dynamic';
const CustomerProfile = dynamic(() => import('@/views/admin/CustomerProfile'), { ssr: false });
export default function CustomerProfilePage() { return <CustomerProfile />; }
