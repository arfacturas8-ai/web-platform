'use client';
import dynamic from 'next/dynamic';
const Products = dynamic(() => import('@/views/admin/inventory/Products'), { ssr: false });
export default function ProductsPage() { return <Products />; }
