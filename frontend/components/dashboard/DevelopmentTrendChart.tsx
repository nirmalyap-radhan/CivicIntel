'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { useCity } from '@/context/CityContext';
import { Badge } from '@/components/common/Badge';

export function DevelopmentTrendChart() {
  const { selectedCity, kpis, cityProfile, benchmarkProfile } = useCity();
  const [selectedMetricId, setSelectedMetricId] = useState<string>('dev-score');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeMetric = kpis.find((k) => k.id === selectedMetricId) || kpis[0];
  const chartData = activeMetric?.historicalData || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base">
                Multi-Year Civic Trajectory
              </CardTitle>
              <Badge variant="teal" size="sm">
                2021 - 2026
              </Badge>
            </div>
            <CardDescription>
              Comparing {cityProfile.name} historical progression against {benchmarkProfile.name} baseline.
            </CardDescription>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {kpis.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetricId(metric.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedMetricId === metric.id
                    ? 'bg-[#0b1528] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {metric.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] p-4 pt-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cityColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="benchmarkColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1528',
                  borderRadius: '0.5rem',
                  border: '1px solid #1e293b',
                  color: '#f8fafc',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toFixed(1)} / 100`,
                  name === 'value' ? cityProfile.name : benchmarkProfile.name,
                ]}
                labelStyle={{ fontWeight: 600, color: '#2dd4bf', marginBottom: '4px' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
                formatter={(value) =>
                  value === 'value'
                    ? `${cityProfile.name} (Active)`
                    : `${benchmarkProfile.name} (Benchmark)`
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                name="value"
                stroke="#0d9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cityColor)"
                activeDot={{ r: 5, strokeWidth: 1, stroke: '#ffffff' }}
              />
              <Area
                type="monotone"
                dataKey="benchmark"
                name="benchmark"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#benchmarkColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
            Rendering multi-year trend analysis...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
