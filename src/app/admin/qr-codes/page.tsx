'use client';
import dynamic from 'next/dynamic';
const QRCodeGenerator = dynamic(() => import('@/views/admin/QRCodeGenerator'), { ssr: false });
export default function QRCodesPage() { return <QRCodeGenerator />; }
