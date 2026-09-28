import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DayPlan, Stop } from '../types.ts';
import { CATEGORY_CONFIG, formatPrice } from '../utils/itineraryHelper.ts';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';

interface MapViewProps {
  days: DayPlan[];
  selectedDayNumber: number | 'all';
  currency: string;
  onSelectStop?: (stop: Stop, dayNumber: number) => void;
  activeStopName?: string | null;
}

export function MapView({
  days,
  selectedDayNumber,
  currency,
  onSelectStop,
  activeStopName,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'streets' | 'topo'>('streets');

  // Filter stops according to selectedDayNumber
  const currentDays =
    selectedDayNumber === 'all'
      ? days
      : days.filter((d) => d.day === selectedDayNumber);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([35.0116, 135.7681], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Attribution small in corner
      L.control.attribution({ position: 'bottomright' })
        .addAttribution('&copy; OpenStreetMap contributors')
        .addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Routes whenever stops change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routesLayer = routesLayerRef.current;
    if (!map || !markersLayer || !routesLayer) return;

    markersLayer.clearLayers();
    routesLayer.clearLayers();

    const allCoords: [number, number][] = [];

    // Distinct colors for days when in 'all' view
    const DAY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    currentDays.forEach((dayPlan, dayIdx) => {
      const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const dayCoords: [number, number][] = [];

      dayPlan.stops.forEach((stop, stopIdx) => {
        if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;
        const latLng: [number, number] = [stop.lat, stop.lng];
        allCoords.push(latLng);
        dayCoords.push(latLng);

        const catConfig = CATEGORY_CONFIG[stop.category] || CATEGORY_CONFIG.other;
        const isSelected = activeStopName === stop.name;

        // Custom HTML pin with stop order number
        const markerHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            background: ${catConfig.markerColor};
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            color: #ffffff;
            font-weight: 700;
            font-size: ${isSelected ? '14px' : '12px'};
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
            ${isSelected ? 'outline: 3px solid #3b82f6;' : ''}
          ">
            ${stopIdx + 1}
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${catConfig.markerColor};
            "></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-map-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(latLng, { icon: customIcon });

        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; max-width: 240px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; background: ${catConfig.bg}; color: ${catConfig.color}; padding: 2px 6px; border-radius: 4px;">
                Day ${dayPlan.day} • Stop ${stopIdx + 1}
              </span>
              <span style="font-size: 11px; color: #64748b; text-transform: capitalize;">
                ${stop.best_time}
              </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${stop.name}</h4>
            <p style="margin: 0 0 6px 0; font-size: 12px; line-height: 1.4; color: #475569;">${stop.description}</p>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
              <span style="font-weight: 600; color: #0f172a;">${formatPrice(stop.est_entry_price, currency)}</span>
              <span style="color: #64748b;">⏱ ${stop.duration_hours}h</span>
            </div>
            <div style="margin-top: 8px;">
              <a href="https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-size: 11px; color: #2563eb; text-decoration: underline;">
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectStop) onSelectStop(stop, dayPlan.day);
        });

        markersLayer.addLayer(marker);
      });

      // Draw route path between stops in sequence
      if (dayCoords.length > 1) {
        const polyline = L.polyline(dayCoords, {
          color: selectedDayNumber === 'all' ? dayColor : '#3b82f6',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round',
        });
        routesLayer.addLayer(polyline);
      }
    });

    // Fit bounds if coords exist
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 15,
        animate: true,
      });
    }

    // Trigger invalidateSize after slight delay for proper container rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [currentDays, selectedDayNumber, activeStopName, currency, onSelectStop]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const allCoords: [number, number][] = [];
    currentDays.forEach((d) => {
      d.stops.forEach((s) => {
        if (s.lat && s.lng) allCoords.push([s.lat, s.lng]);
      });
    });
    if (allCoords.length > 0) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-sm overflow-hidden border border-slate-200 shadow-inner bg-slate-100 dark:bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-sm shadow-md border border-slate-200/80 dark:border-slate-700 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-700" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetBounds}
          className="p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm shadow-md border border-slate-200/80 dark:border-slate-700 transition flex items-center justify-center"
          title="Center on stops"
          aria-label="Fit stops in view"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-2 rounded-sm shadow-md border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 max-w-[280px]">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Geographic Proximity Route</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Numbered in non-zigzag visiting sequence (1 → 2 → 3 → 4).
        </p>
      </div>
    </div>
  );
}
