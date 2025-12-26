'use client';
import dynamic from 'next/dynamic';
const TableManagement = dynamic(() => import('@/views/admin/TableManagement').then(m => ({ default: m.TableManagement })), { ssr: false });
export default function TablesPage() { return <TableManagement />; }
