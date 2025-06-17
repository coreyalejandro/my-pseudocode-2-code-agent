'use client';
import dynamic from 'next/dynamic';
const PseudocodeAgent = dynamic(() => import('../components/PseudocodeAgent'), { ssr: false });
export default function Home() {
  return <PseudocodeAgent />;
}
