'use client';
import dynamic from 'next/dynamic';
const POS = dynamic(() => import('@/views/admin/POS'), { ssr: false });
export default function POSPage() { return <POS />; }
