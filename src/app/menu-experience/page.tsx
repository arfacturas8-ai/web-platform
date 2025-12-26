'use client';
import dynamic from 'next/dynamic';
const MenuExperience = dynamic(() => import('@/views/MenuExperience'), { ssr: false });
export default function MenuExperiencePage() { return <MenuExperience />; }
