'use client';
import dynamic from 'next/dynamic';
const FinanceDashboard = dynamic(() => import('@/views/admin/finance/FinanceDashboard'), { ssr: false });
export default function FinancePage() { return <FinanceDashboard />; }
