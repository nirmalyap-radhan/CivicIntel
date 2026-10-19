'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  GitCompare,
  Lightbulb,
  Cpu,
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useCity } from '@/context/CityContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, selectedCity, gaps } = useCity();

  const criticalGapsCount = gaps.filter((g) => g.severity === 'Critical').length;

  const navItems = [
    {
      label: 'Overview',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'City Intelligence',
      href: '/intelligence',
      icon: Building2,
      badge: null,
    },
    {
      label: 'City Comparison',
      href: '/comparison',
      icon: GitCompare,
      badge: 'Benchmarking',
    },
    {
      label: 'Development Insights',
      href: '/insights',
      icon: Lightbulb,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} Critical` : null,
      badgeVariant: 'critical' as const,
    },
    {
      label: 'AI Policy Engine',
      href: '/policy-engine',
      icon: Cpu,
      badge: 'Simulation',
      badgeVariant: 'teal' as const,
    },
    {
      label: 'Growth Forecasts',
      href: '/forecasts',
      icon: TrendingUp,
      badge: '2026-32',
    },
    {
      label: 'Citizen Engagement',
      href: '/citizen-engagement',
      icon: Users,
      badge: null,
    },
    {
      label: 'Investor Marketplace',
      href: '/investor-marketplace',
      icon: Briefcase,
      badge: 'PPP',
    },
    {
      label: 'Reports & Dossiers',
      href: '/reports',
      icon: FileText,
      badge: null,
    },
    {
      label: 'Settings & Models',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-[#0b1528] text-slate-200 border-r border-[#1a2b49] transition-all duration-300 ease-in-out shrink-0 z-30 select-none',
        isSidebarCollapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1a2b49]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
            <Compass className="w-4 h-4 text-teal-400" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                CivicIntel
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  AI
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                Urban Benchmarking Engine
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#15233c] transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Active Focus Pill */}
      {!isSidebarCollapsed && (
        <div className="px-4 py-2.5 bg-[#0e1a32] border-b border-[#1a2b49]/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Active Zone:</span>
          <span className="font-semibold text-teal-300 capitalize flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />
            {selectedCity}
          </span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-teal-500/15 text-teal-200 border border-teal-500/30 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#14233c] border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-teal-400'
                    : 'text-slate-400 group-hover:text-slate-200'
                )}
              />

              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'default'}
                      size="sm"
                      className="ml-2 shrink-0 text-[10px] py-0 px-1.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Verification / Mode Footnote */}
      <div className="p-3 border-t border-[#1a2b49] bg-[#091122]">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-slate-300 font-medium">Demonstration Mode</span>
              <span className="text-[10px] text-slate-500">Modeled Civic Analytics</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Verified Modeling Engine">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
