import React from 'react';

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="ui-card" {...props}>{children}</div>;
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
} 