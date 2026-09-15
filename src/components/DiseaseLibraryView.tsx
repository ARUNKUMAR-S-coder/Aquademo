import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  AlertOctagon,
  CheckCircle2,
  Droplets,
  Activity,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { FISH_DISEASES } from '../data/diseases';

export const DiseaseLibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(0);

  const diseaseList = Object.values(FISH_DISEASES);

  const filteredDiseases = diseaseList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pathogen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clinicalSigns.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === 'all' || item.scientificCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Healthy
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            <Activity className="w-3 h-3 text-indigo-600" />
            Moderate Risk
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
            <AlertOctagon className="w-3 h-3 text-amber-600" />
            High Risk
          </span>
        );
      case 'critical':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Critical Threat
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Aquaculture Pathology Reference
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Clinical diagnostic protocols for all 7 supported fish health classifications
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms, pathogens, or disease names..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 appearance-none cursor-pointer"
          >
            <option value="all">All Pathogen Types</option>
            <option value="Bacterial">Bacterial</option>
            <option value="Fungal">Fungal</option>
            <option value="Viral">Viral</option>
            <option value="Parasitic">Parasitic</option>
            <option value="Healthy">Healthy Fish</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDiseases.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0">
                    {item.id}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">
                        {item.name}
                      </h3>
                      {getSeverityBadge(item.severity)}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.scientificCategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.commonName} • <span className="italic">{item.pathogen}</span>
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 border-t border-slate-100 pt-4 space-y-4 bg-slate-50/40">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {item.shortDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Clinical Signs & Symptoms
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1.5">
                        {item.clinicalSigns.map((sign, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-slate-300">•</span>
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Immediate Quarantine Actions
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1.5">
                        {item.immediateActions.map((act, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Approved Treatments
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1.5">
                        {item.treatmentOptions.map((treat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500">▸</span>
                            <span>{treat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                        Water Quality & Biosecurity
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.waterQualityFocus.map((param, i) => (
                          <div
                            key={i}
                            className="bg-cyan-50 text-cyan-900 px-2 py-1 rounded-lg text-[11px] font-medium"
                          >
                            {param}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
