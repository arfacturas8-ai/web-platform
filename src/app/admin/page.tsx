'use client';
import dynamic from 'next/dynamic';
const Dashboard = dynamic(() => import('@/views/admin/Dashboard').then(m => ({ default: m.Dashboard })), { ssr: false });
export default function AdminDashboardPage() { return <Dashboard />; }
