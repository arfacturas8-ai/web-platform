'use client';
import dynamic from 'next/dynamic';
const Reports = dynamic(() => import('@/views/admin/Reports'), { ssr: false });
export default function ReportsPage() { return <Reports />; }
