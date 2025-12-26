'use client';
import dynamic from 'next/dynamic';
const GiftCardManagement = dynamic(() => import('@/views/admin/GiftCardManagement'), { ssr: false });
export default function GiftCardsPage() { return <GiftCardManagement />; }
