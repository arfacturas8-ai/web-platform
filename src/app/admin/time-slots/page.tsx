'use client';
import dynamic from 'next/dynamic';
const TimeSlots = dynamic(() => import('@/views/admin/TimeSlots'), { ssr: false });
export default function TimeSlotsPage() { return <TimeSlots />; }
