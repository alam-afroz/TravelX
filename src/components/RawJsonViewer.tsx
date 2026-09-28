import { useState } from 'react';
import { Itinerary } from '../types.ts';
import { validateSchema } from '../utils/itineraryHelper.ts';
import { Copy, Check, Download, AlertCircle, CheckCircle2, Code2, RefreshCw } from 'lucide-react';

interface RawJsonViewerProps {
  itinerary: Itinerary;
  onImportJson?: (imported: Itinerary) => void;
}

export function RawJsonViewer({ itinerary, onImportJson }: RawJsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const jsonString = JSON.stringify(itinerary, null, 2);
  const validation = validateSchema(itinerary);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handleDownload = () => {
    const filename = `${itinerary.city.toLowerCase().replace(/\s+/g, '-')}-itinerary.json`;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = () => {
    setEditedText(jsonString);
    setIsEditing(true);
    setParseError(null);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(editedText);
      const val = validateSchema(parsed);
      if (!val.valid) {
        setParseError(`Schema Validation Failed:\n${val.errors.join('\n')}`);
        return;
      }
      if (onImportJson) {
        onImportJson(parsed);
      }
      setIsEditing(false);
      setParseError(null);
    } catch (e: any) {
      setParseError(`Invalid JSON Syntax: ${e.message}`);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                {itinerary.city.toLowerCase()}-itinerary.json
              </h3>
              {validation.valid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Schema Valid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Schema Warning ({validation.errors.length})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Matches specified travel schema without markdown fences or extraneous text
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleApplyJson}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-xs rounded-lg transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartEdit}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                Paste / Edit JSON
              </button>
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Pure JSON!' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition"
                title="Download JSON File"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Parse or Schema Errors */}
      {parseError && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-700 font-mono whitespace-pre-wrap">
          {parseError}
        </div>
      )}

      {/* Editor or Formatted JSON */}
      {isEditing ? (
        <div className="p-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={22}
            className="w-full font-mono text-xs p-4 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            placeholder="Paste your itinerary JSON here..."
          />
        </div>
      ) : (
        <div className="relative p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed selection:bg-blue-600 selection:text-white">
          <pre className="text-emerald-400">
            <code>{jsonString}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
