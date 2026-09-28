import { TransportationDetail } from '../types.ts';
import {
  Train,
  Plane,
  X,
  AlertCircle,
  Clock,
  Compass,
  CheckCircle2,
  Sparkles,
  Info,
  Coins,
  ShieldCheck,
} from 'lucide-react';

interface TransportationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: TransportationDetail | null;
  loading: boolean;
  error: string | null;
}

export function TransportationDetailModal({
  isOpen,
  onClose,
  detail,
  loading,
  error,
}: TransportationDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs ${
                detail?.mode === 'flight' ? 'bg-sky-600' : 'bg-emerald-600'
              }`}
            >
              {detail?.mode === 'flight' ? (
                <Plane className="w-5 h-5" />
              ) : (
                <Train className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {detail?.title || 'Travel Option Details'}
                </h3>
                {detail?.identifier && (
                  <span className="text-[11px] font-mono font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                    {detail.identifier}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Detailed journey overview & travel class breakdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* AI Estimated Notice / Disclaimer */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                AI-Generated Transportation Information
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
                Fares and schedules are estimates and are not live booking information. This prototype does not connect to live reservation systems or issue tickets.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Generating travel details with Gemini...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <p className="font-semibold">Unable to load details</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : detail ? (
            <div className="space-y-4 text-xs">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Journey Overview</span>
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  {detail.overview}
                </p>
              </div>

              {/* Route & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Route & Key Transits</span>
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-snug">
                    {detail.route}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Duration & Estimated Fare</span>
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-snug">
                    {detail.duration} • <span className="text-emerald-700 font-bold">{detail.estimatedFare}</span>
                  </p>
                </div>
              </div>

              {/* Class Explanation & What it means */}
              <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>What the Selected Class Means</span>
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed font-medium mb-2">
                  {detail.classMeaning}
                </p>
                {detail.classInfo && (
                  <p className="text-[11px] text-blue-800 leading-relaxed border-t border-blue-200/60 pt-2">
                    {detail.classInfo}
                  </p>
                )}
              </div>

              {/* Travel Tips */}
              {detail.travelTips && detail.travelTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Practical Travel Tips</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {detail.travelTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs text-slate-700"
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Informational prototype only • No live booking API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
