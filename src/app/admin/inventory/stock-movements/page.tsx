'use client';
import dynamic from 'next/dynamic';
const StockMovements = dynamic(() => import('@/views/admin/inventory/StockMovements'), { ssr: false });
export default function StockMovementsPage() { return <StockMovements />; }
