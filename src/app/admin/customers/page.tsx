'use client';
import dynamic from 'next/dynamic';
const Customers = dynamic(() => import('@/views/admin/Customers').then(m => ({ default: m.Customers })), { ssr: false });
export default function CustomersPage() { return <Customers />; }
