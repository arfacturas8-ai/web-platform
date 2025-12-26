'use client';
import dynamic from 'next/dynamic';
const Cart = dynamic(() => import('@/views/Cart'), { ssr: false });
export default function CartPage() { return <Cart />; }
