'use client';
import dynamic from 'next/dynamic';
const PurchaseOrders = dynamic(() => import('@/views/admin/inventory/PurchaseOrders'), { ssr: false });
export default function PurchaseOrdersPage() { return <PurchaseOrders />; }
