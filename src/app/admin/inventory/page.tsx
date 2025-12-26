'use client';
import dynamic from 'next/dynamic';
const Inventory = dynamic(() => import('@/views/admin/inventory/Inventory'), { ssr: false });
export default function InventoryPage() { return <Inventory />; }
