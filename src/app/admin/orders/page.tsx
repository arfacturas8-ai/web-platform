'use client';
import dynamic from 'next/dynamic';
const Orders = dynamic(() => import('@/views/admin/Orders'), { ssr: false });
export default function OrdersPage() { return <Orders />; }
