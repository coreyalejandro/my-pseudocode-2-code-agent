'use client';
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
mermaid.initialize({ startOnLoad: false });
export default function FlowchartRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && code) {
      mermaid.render('mermaid-chart', code, (svg) => {
        ref.current!.innerHTML = svg;
      });
    }
  }, [code]);
  return <div className="p-4 border rounded overflow-x-auto"><div ref={ref} /></div>;
}
