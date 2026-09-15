import React, { useState, useEffect } from 'react';
import { AppView, ScreeningResult, ImageQualityMetrics } from './types';
import { Navbar } from './components/Navbar';
import { ScreeningView } from './components/ScreeningView';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { DiseaseLibraryView } from './components/DiseaseLibraryView';
import { AboutView } from './components/AboutView';
import { runFishDiseaseInference } from './utils/onnxInference';

const STORAGE_KEY = 'aquascan_history_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('screen');
  const [history, setHistory] = useState<ScreeningResult[]>([]);
  const [activeResult, setActiveResult] = useState<ScreeningResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load local screening history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ScreeningResult[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Failed to persist history to localStorage:', e);
    }
  };

  const handleAnalyzeImage = async (
    source: CanvasImageSource,
    dataUrl: string,
    quality: ImageQualityMetrics
  ) => {
    setIsAnalyzing(true);
    try {
      const inference = await runFishDiseaseInference(source);

      const newResult: ScreeningResult = {
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        timestamp: Date.now(),
        primaryClassId: inference.primaryClassId,
        primaryClassName: inference.primaryClassName,
        primaryProbability: inference.primaryProbability,
        probabilities: inference.probabilities,
        rawLogits: inference.rawLogits,
        inferenceTimeMs: inference.inferenceTimeMs,
        imageThumbnail: dataUrl,
        deviceType: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        qualityMetrics: quality
      };

      const updatedHistory = [newResult, ...history];
      saveHistory(updatedHistory);
      setActiveResult(newResult);
      setCurrentView('result');
    } catch (err) {
      console.error('Inference error:', err);
      alert('An error occurred during inference. Please check image input.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectResult = (result: ScreeningResult) => {
    setActiveResult(result);
    setCurrentView('result');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all screening records from local storage?')) {
      saveHistory([]);
    }
  };

  const handleDeleteSingle = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        historyCount={history.length}
      />

      <main className="flex-1 pb-16">
        {currentView === 'screen' && (
          <ScreeningView
            onAnalyzeImage={handleAnalyzeImage}
            isAnalyzing={isAnalyzing}
          />
        )}

        {currentView === 'result' && activeResult && (
          <ResultView
            result={activeResult}
            onBackToScreen={() => setCurrentView('screen')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={handleSelectResult}
            onClearHistory={handleClearHistory}
            onDeleteSingle={handleDeleteSingle}
            onGoToScreen={() => setCurrentView('screen')}
          />
        )}

        {currentView === 'diseases' && <DiseaseLibraryView />}

        {currentView === 'about' && <AboutView />}
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AquaScan AI • panda992/fish_disease_datasets ViT Inference Engine
          </span>
          <span className="text-slate-400 text-[11px]">
            In-Browser WebAssembly ONNX Runtime • Vercel Ready
          </span>
        </div>
      </footer>
    </div>
  );
}
