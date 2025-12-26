'use client';
import dynamic from 'next/dynamic';
const Popups = dynamic(() => import('@/views/admin/Popups'), { ssr: false });
export default function PopupsPage() { return <Popups />; }
