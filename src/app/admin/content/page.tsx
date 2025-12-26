'use client';
import dynamic from 'next/dynamic';
const ContentManager = dynamic(() => import('@/views/admin/ContentManager'), { ssr: false });
export default function ContentPage() { return <ContentManager />; }
