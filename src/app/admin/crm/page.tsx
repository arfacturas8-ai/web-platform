'use client';
import dynamic from 'next/dynamic';
const CRM = dynamic(() => import('@/views/admin/CRM'), { ssr: false });
export default function CRMPage() { return <CRM />; }
