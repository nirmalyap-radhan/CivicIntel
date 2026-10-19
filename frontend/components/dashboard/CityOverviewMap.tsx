'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Hospital,
  GraduationCap,
  Bus,
  Factory,
  Wheat,
  Building,
  Info,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useCity } from '@/context/CityContext';
import { CivicAssetPoint } from '@/types';

export function CityOverviewMap() {
  const { selectedCity, cityProfile, assets } = useCity();
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<CivicAssetPoint | null>(null);

  const layerTypes = [
    { id: 'all', label: 'All Assets', icon: Layers },
    { id: 'healthcare', label: 'Health', icon: Hospital },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'transit', label: 'Transit', icon: Bus },
    { id: 'industrial', label: 'Industrial', icon: Factory },
    { id: 'agriculture', label: 'Agri-Hubs', icon: Wheat },
  ];

  const filteredAssets =
    activeLayer === 'all' ? assets : assets.filter((a) => a.type === activeLayer);

  // Geographic SVG projection normalization for Koraput vs Bhubaneswar
  const isKoraput = selectedCity === 'koraput';

  // Coordinate ranges for simple mock SVG projection
  // Koraput: Lat 18.7 to 19.1, Lng 82.4 to 83.2
  // BBSR: Lat 20.1 to 20.4, Lng 85.6 to 85.9
  const getCoordinates = (lat: number, lng: number) => {
    if (isKoraput) {
      const x = ((lng - 82.35) / (83.25 - 82.35)) * 100;
      const y = 100 - ((lat - 18.7) / (19.05 - 18.7)) * 100;
      return { x: Math.max(8, Math.min(92, x)), y: Math.max(10, Math.min(90, y)) };
    } else {
      const x = ((lng - 85.65) / (85.9 - 85.65)) * 100;
      const y = 100 - ((lat - 20.12) / (20.38 - 20.12)) * 100;
      return { x: Math.max(8, Math.min(92, x)), y: Math.max(10, Math.min(90, y)) };
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'healthcare':
        return <Hospital className="w-3.5 h-3.5 text-rose-500" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-500" />;
      case 'transit':
        return <Bus className="w-3.5 h-3.5 text-amber-500" />;
      case 'industrial':
        return <Factory className="w-3.5 h-3.5 text-purple-500" />;
      case 'agriculture':
        return <Wheat className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Building className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base">
                Civic Geography & Asset Nodes
              </CardTitle>
              <Badge variant="teal" size="sm">
                {cityProfile.name} Territory
              </Badge>
            </div>
            <CardDescription>
              {isKoraput
                ? 'Highland District Map with 14 Blocks & Strategic Production Corridors'
                : 'Smart Capital Region with 67 Municipal Wards & IT Arteries'}
            </CardDescription>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {layerTypes.map((layer) => {
              const Icon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded-md transition-all font-medium whitespace-nowrap ${
                    activeLayer === layer.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-3 pt-1 flex flex-col">
        {/* Interactive Stylized Map Canvas */}
        <div className="relative w-full h-[320px] bg-[#0b1528] rounded-xl overflow-hidden border border-[#1a2b49] shadow-inner select-none flex items-center justify-center">
          {/* Topographic and District Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Stylized contours / rivers */}
            {isKoraput ? (
              <>
                {/* Kolab river flow */}
                <path
                  d="M 50 10 Q 150 120 280 180 T 500 300"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                />
                {/* Eastern Ghats Mountain Contours */}
                <path
                  d="M 20 60 Q 120 40 240 90 T 480 70"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 80 240 Q 220 200 340 260 T 540 220"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                  strokeDasharray="4 4"
                />
              </>
            ) : (
              <>
                {/* Kuakhai / Daya River System */}
                <path
                  d="M 380 10 Q 420 150 480 320"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeOpacity="0.4"
                />
                {/* Janpath & NH-16 Highway Spine */}
                <path
                  d="M 80 30 L 460 300"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  strokeDasharray="6 3"
                />
              </>
            )}
          </svg>

          {/* Region Label Watermark */}
          <div className="absolute top-3 left-4 pointer-events-none text-left z-0">
            <div className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-widest opacity-80">
              {isKoraput ? 'Eastern Ghats Agro-Forestry Zone' : 'Mahanadi Delta Urban Basin'}
            </div>
            <div className="text-[10px] text-slate-400">
              Center: {cityProfile.coordinates.lat.toFixed(4)}°N, {cityProfile.coordinates.lng.toFixed(4)}°E
            </div>
          </div>

          {/* Key District Clusters / Blocks Labels */}
          {isKoraput ? (
            <>
              <div className="absolute top-[28%] left-[22%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Jeypore Plains
              </div>
              <div className="absolute top-[48%] left-[45%] text-[10px] font-semibold text-teal-300/80 pointer-events-none">
                Koraput Valley
              </div>
              <div className="absolute top-[68%] left-[65%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Sunabeda Plateau
              </div>
              <div className="absolute top-[18%] left-[78%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Bandhugaon Ghat
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-[20%] left-[30%] text-[10px] font-semibold text-teal-300/80 pointer-events-none">
                Patia IT Corridor
              </div>
              <div className="absolute top-[45%] left-[55%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Central Smart Core
              </div>
              <div className="absolute top-[75%] left-[40%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Old Town Heritage Zone
              </div>
              <div className="absolute top-[82%] left-[65%] text-[10px] font-semibold text-slate-400 pointer-events-none">
                Gangua Catchment
              </div>
            </>
          )}

          {/* Interactive Pins */}
          {filteredAssets.map((asset) => {
            const { x, y } = getCoordinates(asset.coordinates.lat, asset.coordinates.lng);
            const isSelected = selectedAsset?.id === asset.id;

            return (
              <div
                key={asset.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              >
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className={`relative p-1.5 rounded-full shadow-lg transition-all transform hover:scale-125 focus:outline-none ${
                    isSelected
                      ? 'bg-teal-400 ring-4 ring-teal-400/40 scale-125'
                      : 'bg-white hover:bg-teal-50'
                  }`}
                  aria-label={asset.name}
                >
                  {getAssetIcon(asset.type)}
                </button>

                {/* Pin hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-[#0b1528] text-white text-[10px] py-1 px-2 rounded-md shadow-md border border-[#1a2b49] whitespace-nowrap">
                    <span className="font-semibold">{asset.name}</span>
                    <span className="text-teal-300 block text-[9px]">{asset.subType}</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-[#0b1528] rotate-45 -mt-0.5 border-r border-b border-[#1a2b49]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Asset Details Bar */}
        {selectedAsset ? (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{selectedAsset.name}</span>
                <Badge variant="teal" size="sm">
                  {selectedAsset.status}
                </Badge>
              </div>
              <p className="text-slate-500 text-[11px]">
                {selectedAsset.subType} • Locality: {selectedAsset.locality}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedAsset.metrics.map((m, i) => (
                <div key={i} className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">{m.label}</div>
                  <div className="font-semibold text-slate-800">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2 text-center text-[11px] text-slate-500 py-1">
            Click on any asset node on the map to inspect capacity indicators and status.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
