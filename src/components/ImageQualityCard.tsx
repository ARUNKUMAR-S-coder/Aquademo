import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Eye, Zap } from 'lucide-react';
import { ImageQualityMetrics } from '../types';

interface ImageQualityCardProps {
  metrics: ImageQualityMetrics;
  onProceed: () => void;
  onRetake: () => void;
  isLoading?: boolean;
}

export const ImageQualityCard: React.FC<ImageQualityCardProps> = ({
  metrics,
  onProceed,
  onRetake,
  isLoading = false
}) => {
  const getRatingBadge = () => {
    switch (metrics.qualityRating) {
      case 'Optimal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Optimal Quality
          </span>
        );
      case 'Acceptable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            Acceptable Quality
          </span>
        );
      case 'Poor':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Sub-optimal Image
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-600" />
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
            Image Quality Assessment
          </h3>
        </div>
        {getRatingBadge()}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Resolution</span>
          <span className="text-xs font-semibold text-slate-800">
            {metrics.width} × {metrics.height} px
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Brightness</span>
          <span className="text-xs font-semibold text-slate-800">
            {metrics.brightness} <span className="text-[10px] text-slate-400">/ 255</span>
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Contrast (SD)</span>
          <span className="text-xs font-semibold text-slate-800">
            {metrics.contrast}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Sharpness Index</span>
          <span className="text-xs font-semibold text-slate-800">
            {metrics.sharpnessScore}
          </span>
        </div>
      </div>

      {metrics.warnings.length > 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
          <p className="font-semibold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            Quality Considerations:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1 text-amber-800">
            {metrics.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Optimal clarity, exposure, and contrast for Vision Transformer patch analysis.
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          id="btn-run-inference"
          onClick={onProceed}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running ViT Real Inference...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>Run Real AI Diagnosis</span>
            </>
          )}
        </button>

        <button
          id="btn-retake-image"
          onClick={onRetake}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          Retake / Replace
        </button>
      </div>
    </div>
  );
};
