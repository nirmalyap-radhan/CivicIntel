'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export function CityComparisonChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const benchmarkData = [
    {
      sector: 'Healthcare Access',
      koraput: 52.1,
      bhubaneswar: 88.5,
      stateAvg: 65.4,
    },
    {
      sector: 'Education Retention',
      koraput: 61.4,
      bhubaneswar: 94.6,
      stateAvg: 76.8,
    },
    {
      sector: 'Piped Tap Water',
      koraput: 48.2,
      bhubaneswar: 93.8,
      stateAvg: 67.4,
    },
    {
      sector: 'Paved Roads',
      koraput: 74.6,
      bhubaneswar: 99.2,
      stateAvg: 86.5,
    },
    {
      sector: 'Formal Jobs %',
      koraput: 26.8,
      bhubaneswar: 84.1,
      stateAvg: 48.5,
    },
    {
      sector: 'Broadband Access',
      koraput: 24.1,
      bhubaneswar: 88.5,
      stateAvg: 51.2,
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm sm:text-base">
              Cross-City Structural Comparison
            </CardTitle>
            <CardDescription>
              Koraput vs Bhubaneswar vs Odisha State Baseline (% or Index)
            </CardDescription>
          </div>
          <Badge variant="navy" size="sm">
            Benchmarking
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] p-4 pt-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={benchmarkData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="sector"
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={0}
                tickFormatter={(val) => (val.length > 12 ? `${val.slice(0, 10)}..` : val)}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
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
                formatter={(val: any) => [`${val}% / Score`, '']}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Bar
                dataKey="koraput"
                name="Koraput"
                fill="#0d9488"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="bhubaneswar"
                name="Bhubaneswar (Capital)"
                fill="#1e3a8a"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="stateAvg"
                name="Odisha State Avg"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
            Loading cross-city benchmarking...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
