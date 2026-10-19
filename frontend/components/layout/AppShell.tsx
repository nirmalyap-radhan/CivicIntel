'use client';

import React, { useState } from 'react';
import { CityProvider } from '@/context/CityContext';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <CityProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-xs bg-[#0b1528] shadow-2xl z-50">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNav onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </CityProvider>
  );
}
