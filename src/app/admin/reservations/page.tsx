'use client';
import dynamic from 'next/dynamic';
const ReservationManagement = dynamic(() => import('@/views/admin/ReservationManagement').then(m => ({ default: m.ReservationManagement })), { ssr: false });
export default function ReservationsManagementPage() { return <ReservationManagement />; }
