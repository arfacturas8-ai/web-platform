'use client';
import dynamic from 'next/dynamic';
const DeliveryMap = dynamic(() => import('@/views/admin/DeliveryMap'), { ssr: false });
export default function DeliveryMapPage() { return <DeliveryMap />; }
