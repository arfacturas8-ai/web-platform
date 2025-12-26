'use client';
import dynamic from 'next/dynamic';
const KitchenDisplay = dynamic(() => import('@/views/admin/KitchenDisplay'), { ssr: false });
export default function KitchenPage() { return <KitchenDisplay />; }
