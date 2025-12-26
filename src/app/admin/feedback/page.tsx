'use client';
import dynamic from 'next/dynamic';
const Reviews = dynamic(() => import('@/views/admin/Reviews'), { ssr: false });
export default function FeedbackPage() { return <Reviews />; }
