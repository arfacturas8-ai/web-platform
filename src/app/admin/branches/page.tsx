'use client';
import dynamic from 'next/dynamic';
const Branches = dynamic(() => import('@/views/admin/Branches'), { ssr: false });
export default function BranchesPage() { return <Branches />; }
