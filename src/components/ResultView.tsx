import React, { useState } from 'react';
import {
  FileDown,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Activity,
  Droplets,
  Layers,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';
import { ScreeningResult } from '../types';
import { FISH_DISEASES } from '../data/diseases';
import { generateFishDiseasePDF } from '../utils/pdfReport';
import { computeOcclusionSensitivity } from '../utils/onnxInference';

interface ResultViewProps {
  result: ScreeningResult;
  onBackToScreen: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onBackToScreen
}) => {
  const disease = FISH_DISEASES[result.primaryClassId] || FISH_DISEASES[4];
  const isHealthy = result.primaryClassId === 4;

  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(
    result.saliencyMapUrl || null
  );
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = useState(false);
  const [heatmapProgress, setHeatmapProgress] = useState(0);

  const handleGenerateHeatmap = async () => {
    if (heatmapUrl || isGeneratingHeatmap) return;
    setIsGeneratingHeatmap(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = result.imageThumbnail;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const url = await computeOcclusionSensitivity(
        img,
        result.primaryClassId,
        (progress) => setHeatmapProgress(progress)
      );
      setHeatmapUrl(url);
    } catch (err) {
      console.warn('Failed to generate occlusion heatmap:', err);
    } finally {
      setIsGeneratingHeatmap(false);
    }
  };

  const getSeverityBadge = () => {
    switch (disease.severity) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Normal / Low Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            Moderate Concern
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            High Risk Severity
          </span>
        );
      case 'critical':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Critical Pathological Threat
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          id="btn-back-to-screen"
          onClick={onBackToScreen}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Screening View</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-download-pdf-report"
            onClick={() => generateFishDiseasePDF(result)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>Download Clinical PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnosis Hero Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 transition-all ${
          isHealthy
            ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 border-emerald-200 shadow-sm'
            : 'bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 border-rose-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Report #{result.id}
              </span>
              {getSeverityBadge()}
              <span className="text-[11px] text-slate-500 font-mono">
                Latency: {result.inferenceTimeMs}ms
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {result.primaryClassName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              <span className="font-semibold text-slate-800">
                {disease.commonName}
              </span>{' '}
              • Pathogen: <span className="italic">{disease.pathogen}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs min-w-44">
            <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-baseline gap-1">
              {(result.primaryProbability * 100).toFixed(1)}
              <span className="text-lg font-bold text-slate-500">%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              ViT-B/16 Classification
            </span>
          </div>
        </div>
      </div>

      {/* Dual Column: Image & All 7 Probabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Specimen & Visual Saliency */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-600" />
                Specimen Capture & Saliency
              </h3>
              {heatmapUrl && (
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Heatmap Active
                </span>
              )}
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
              <img
                src={heatmapUrl || result.imageThumbnail}
                alt="Analyzed specimen"
                className="max-h-full max-w-full object-contain"
              />
              {isGeneratingHeatmap && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 p-4 text-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium">
                    Computing Patch Occlusion Saliency...
                  </span>
                  <span className="text-[11px] text-cyan-300 font-mono">
                    {heatmapProgress}% complete
                  </span>
                </div>
              )}
            </div>

            {/* Saliency Toggle Action */}
            <div className="pt-1">
              {!heatmapUrl ? (
                <button
                  id="btn-compute-heatmap"
                  onClick={handleGenerateHeatmap}
                  disabled={isGeneratingHeatmap}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Explain with Occlusion Heatmap</span>
                </button>
              ) : (
                <button
                  id="btn-toggle-original-heatmap"
                  onClick={() => setHeatmapUrl(null)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  Switch Back to Original Specimen
                </button>
              )}
            </div>

            {/* Quality Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                <span className="text-slate-400 block text-[10px]">Quality Rating</span>
                <span className="font-semibold text-slate-800">
                  {result.qualityMetrics.qualityRating}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                <span className="text-slate-400 block text-[10px]">Resolution</span>
                <span className="font-semibold text-slate-800">
                  {result.qualityMetrics.width} × {result.qualityMetrics.height}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full 7-Class Distribution */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  Full 7-Class Probability Distribution
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real softmax classification probabilities across all classes
                </p>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                Sum: 100%
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {result.probabilities.map((item) => {
                const isSelected = item.classId === result.primaryClassId;
                const percent = item.percentage;
                return (
                  <div
                    key={item.classId}
                    className={`p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-50/60 border-cyan-300 ring-1 ring-cyan-200'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400 w-4">
                          {item.classId}
                        </span>
                        <span
                          className={`font-semibold ${
                            isSelected ? 'text-cyan-900' : 'text-slate-700'
                          }`}
                        >
                          {item.className}
                        </span>
                      </div>
                      <span
                        className={`font-bold font-mono text-xs ${
                          isSelected ? 'text-cyan-700' : 'text-slate-500'
                        }`}
                      >
                        {percent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                            : 'bg-slate-400/80'
                        }`}
                        style={{ width: `${Math.max(1, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clinical Presentation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Pathological Signs & Symptoms
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            {disease.clinicalSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-slate-300 font-bold">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Immediate Quarantine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Immediate Quarantine Protocols
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            {disease.immediateActions.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment Options */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Approved Treatment Regimens
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            {disease.treatmentOptions.map((opt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">▸</span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Water Quality Focus */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            Critical Water Quality Parameters
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {disease.waterQualityFocus.map((param, i) => (
              <div
                key={i}
                className="bg-cyan-50 border border-cyan-100 text-cyan-900 p-2.5 rounded-xl text-xs font-medium"
              >
                {param}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
