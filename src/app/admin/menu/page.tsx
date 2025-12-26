'use client';
import dynamic from 'next/dynamic';
const MenuManagement = dynamic(() => import('@/views/admin/MenuManagement').then(m => ({ default: m.MenuManagement })), { ssr: false });
export default function MenuManagementPage() { return <MenuManagement />; }
