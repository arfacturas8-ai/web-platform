'use client';
import dynamic from 'next/dynamic';
const OnlineMenu = dynamic(() => import('@/views/OnlineMenu'), { ssr: false });
export default function OrderPage() { return <OnlineMenu />; }
