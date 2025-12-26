'use client';
import dynamic from 'next/dynamic';
const OrderTracking = dynamic(() => import('@/views/OrderTracking'), { ssr: false });
export default function OrderTrackingPage() {
  return <OrderTracking />;
}
