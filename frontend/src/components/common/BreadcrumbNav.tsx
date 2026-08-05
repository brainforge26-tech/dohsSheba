'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-semibold mb-4">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-purple-700 transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-slate-900 font-bold truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-purple-700 transition-colors truncate max-w-[180px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
