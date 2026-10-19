'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, HelpCircle } from 'lucide-react';
import { KpiMetric } from '@/types';
import { Card, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  metric: KpiMetric;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function KpiCard({ metric, isSelected = false, onSelect }: KpiCardProps) {
  const isPositive = metric.changePercent >= 0;

  const statusVariant = {
    positive: 'teal',
    benchmark: 'teal',
    warning: 'warning',
    critical: 'critical',
  }[metric.status] as 'teal' | 'warning' | 'critical' | 'default';

  return (
    <Card
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all hover:translate-y-[-1px] group',
        isSelected
          ? 'border-teal-500/80 ring-2 ring-teal-500/10 shadow-md bg-white'
          : 'hover:border-slate-300'
      )}
    >
      <CardContent className="p-4">
        {/* Top Header: Title & Sector */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {metric.title}
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {metric.displayValue}
            </span>
          </div>

          <Badge variant={statusVariant} size="sm">
            {metric.status === 'benchmark' ? 'Benchmark' : metric.status}
          </Badge>
        </div>

        {/* Change delta & comparison */}
        <div className="flex items-center gap-1.5 text-xs mb-3">
          <span
            className={cn(
              'inline-flex items-center font-semibold text-xs',
              isPositive ? 'text-emerald-700' : 'text-rose-700'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />
            )}
            {isPositive ? `+${metric.changePercent}%` : `${metric.changePercent}%`}
          </span>
          <span className="text-slate-400 text-[11px]">YoY trend</span>
        </div>

        {/* Benchmark Delta Footer */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-slate-600 truncate">
            <span className="text-slate-400">Ref:</span>
            <span className="font-medium truncate text-slate-700">
              {metric.benchmarkDelta}
            </span>
          </div>

          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
