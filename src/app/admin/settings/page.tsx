'use client';
import dynamic from 'next/dynamic';
const Settings = dynamic(() => import('@/views/admin/Settings').then(m => ({ default: m.Settings })), { ssr: false });
export default function SettingsPage() { return <Settings />; }
