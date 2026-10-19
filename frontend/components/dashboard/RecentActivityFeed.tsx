'use client';

import React from 'react';
import { Clock, Radio, CheckCircle, FileText, Bell, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useCity } from '@/context/CityContext';
import { RecentActivity } from '@/types';

export function RecentActivityFeed() {
  const { activities, cityProfile } = useCity();

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'policy':
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'survey':
        return <Radio className="w-3.5 h-3.5 text-purple-500" />;
      case 'milestone':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'investment':
        return <Briefcase className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">
                Civic Governance Feed
              </CardTitle>
              <CardDescription>
                Live policy updates, tenders & telemetry from {cityProfile.name}
              </CardDescription>
            </div>
          </div>

          <Badge variant="navy" size="sm">
            Telemetry Feed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-1">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Node dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center group-hover:border-teal-500 transition-colors">
                {getActivityIcon(act.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {act.actor}
                  </span>
                  <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                </div>

                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {act.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.summary}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  {act.metricTag && (
                    <span className="text-[10px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {act.metricTag}
                    </span>
                  )}
                  {act.statusBadge && (
                    <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                      {act.statusBadge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
