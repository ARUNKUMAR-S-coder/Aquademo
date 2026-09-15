import React from 'react';
import {
  Cpu,
  ExternalLink,
  Layers,
  Zap,
  ShieldCheck,
  Award
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Model & System Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real Vision Transformer deep learning running in-browser with ONNX Runtime Web
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            Real Model Specification
          </span>
          <a
            href="https://huggingface.co/panda992/fish_disease_datasets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <span>View on Hugging Face</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            panda992/fish_disease_datasets
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            A state-of-the-art Vision Transformer fine-tuned from Google&apos;s base ViT architecture specifically for teleost fish pathology and early aquaculture epidemic prevention.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Reported Accuracy</span>
            <span className="text-lg font-extrabold text-cyan-600 flex items-center gap-1">
              97.28%
              <Award className="w-4 h-4 text-amber-500" />
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Architecture</span>
            <span className="text-sm font-bold text-slate-800">
              ViT-B/16
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Parameters</span>
            <span className="text-sm font-bold text-slate-800">
              85.8M Params
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Input Tensor</span>
            <span className="text-sm font-bold text-slate-800">
              1×3×224×224
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-2">
            <div className="flex items-center gap-2 text-cyan-900 font-bold text-xs">
              <Zap className="w-4 h-4 text-cyan-600" />
              Client-Side Browser Execution
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inference runs on the user&apos;s local device using ONNX Runtime Web and WebAssembly (WASM). Your fish specimen images are never uploaded to an external server.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              Mathematical Occlusion Saliency
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explainability is achieved through authentic occlusion sensitivity across a 7×7 patch grid, measuring the direct probability delta when portions of the image are masked.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Supported Pathological Classes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { id: 0, name: 'Bacterial Red disease', type: 'Bacterial' },
            { id: 1, name: 'Bacterial diseases - Aeromoniasis', type: 'Bacterial' },
            { id: 2, name: 'Bacterial gill disease', type: 'Bacterial' },
            { id: 3, name: 'Fungal diseases Saprolegniasis', type: 'Fungal' },
            { id: 4, name: 'Healthy Fish', type: 'Healthy' },
            { id: 5, name: 'Parasitic diseases', type: 'Parasitic' },
            { id: 6, name: 'Viral diseases White tail disease', type: 'Viral' }
          ].map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-500 w-5">
                  {c.id}:
                </span>
                <span className="font-medium text-slate-800">{c.name}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                {c.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl text-xs text-slate-600 leading-relaxed space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          Veterinary & Biosafety Advisory
        </h4>
        <p>
          This application is designed as an aquaculture triage and rapid screening aid for fish farmers, aquarists, and field technicians. Model predictions represent probabilistic statistical inferences based on visual features and should not replace microscopic gill/skin scrape analysis, microbiological cultures, or definitive PCR diagnostic assays.
        </p>
      </div>
    </div>
  );
};
