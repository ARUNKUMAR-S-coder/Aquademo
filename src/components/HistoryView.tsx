import React, { useState } from 'react';
import {
  History,
  FileDown,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ScreeningResult } from '../types';
import { generateFishDiseasePDF } from '../utils/pdfReport';

interface HistoryViewProps {
  history: ScreeningResult[];
  onSelectResult: (result: ScreeningResult) => void;
  onClearHistory: () => void;
  onDeleteSingle: (id: string) => void;
  onGoToScreen: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteSingle,
  onGoToScreen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.primaryClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      filterClass === 'all' || item.primaryClassId.toString() === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Screening History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locally stored pathology records • Client-side persistent archive
          </p>
        </div>

        {history.length > 0 && (
          <button
            id="btn-clear-all-history"
            onClick={onClearHistory}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              No Screenings Recorded Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Perform your first automated fish health screening using camera capture or image upload to build an aquatic health audit trail.
            </p>
          </div>
          <button
            id="btn-start-screening-empty"
            onClick={onGoToScreen}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:from-cyan-500 hover:to-blue-500 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Start First Screening</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by diagnosis or report ID..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 appearance-none cursor-pointer"
              >
                <option value="all">All Conditions</option>
                <option value="0">0: Bacterial Red disease</option>
                <option value="1">1: Bacterial Aeromoniasis</option>
                <option value="2">2: Bacterial gill disease</option>
                <option value="3">3: Fungal Saprolegniasis</option>
                <option value="4">4: Healthy Fish</option>
                <option value="5">5: Parasitic diseases</option>
                <option value="6">6: Viral White tail disease</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isHealthy = item.primaryClassId === 4;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-cyan-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.imageThumbnail}
                        alt="Specimen"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-cyan-700 transition-colors">
                          {item.primaryClassName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isHealthy
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {(item.primaryProbability * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.timestamp).toLocaleDateString()} at{' '}
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>•</span>
                        <span>ID: #{item.id}</span>
                        <span>•</span>
                        <span>Quality: {item.qualityMetrics.qualityRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => generateFishDiseasePDF(item)}
                      title="Download PDF Diagnostic Report"
                      className="p-2 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteSingle(item.id)}
                      title="Delete Entry"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectResult(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-cyan-600 transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
