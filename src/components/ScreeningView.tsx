import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  SwitchCamera,
  Image as ImageIcon,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ImageQualityMetrics } from '../types';
import { analyzeImageQuality } from '../utils/imageQuality';
import { SAMPLE_FISH_IMAGES, SampleFishImage } from '../data/sampleImages';
import { ImageQualityCard } from './ImageQualityCard';

interface ScreeningViewProps {
  onAnalyzeImage: (imageElement: CanvasImageSource, dataUrl: string, quality: ImageQualityMetrics) => Promise<void>;
  isAnalyzing: boolean;
}

export const ScreeningView: React.FC<ScreeningViewProps> = ({
  onAnalyzeImage,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<ImageQualityMetrics | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera
  const startCamera = async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access issue:', err);
      // Fallback to basic video without facingMode constraint
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (fallbackErr) {
        setCameraError(
          'Camera access was denied or is unavailable. Please check browser permissions or use image upload.'
        );
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'camera' && !previewImage) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, facingMode, previewImage]);

  // Flip Camera
  const handleToggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Process any image source (file, camera capture, or sample)
  const processImageSource = (img: HTMLImageElement | HTMLCanvasElement, dataUrl: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = (img as HTMLImageElement).naturalWidth || img.width;
    canvas.height = (img as HTMLImageElement).naturalHeight || img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const metrics = analyzeImageQuality(canvas);
    setPreviewImage(dataUrl);
    setQualityMetrics(metrics);
  };

  // Capture from live video
  const handleCaptureCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const metrics = analyzeImageQuality(canvas);
    setPreviewImage(dataUrl);
    setQualityMetrics(metrics);
    stopCamera();
  };

  // File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        processImageSource(img, dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Sample Image Selection
  const handleSelectSample = (sample: SampleFishImage) => {
    const img = new Image();
    img.onload = () => {
      processImageSource(img, sample.dataUrl);
    };
    img.src = sample.dataUrl;
  };

  // Proceed with Inference
  const handleExecuteInference = async () => {
    if (!previewImage || !qualityMetrics) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      await onAnalyzeImage(img, previewImage, qualityMetrics);
    };
    img.src = previewImage;
  };

  // Retake / Reset
  const handleRetake = () => {
    setPreviewImage(null);
    setQualityMetrics(null);
    if (activeTab === 'camera') {
      startCamera(facingMode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Title & Introduction */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          Real panda992/fish_disease_datasets Vision Transformer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Aquaculture Fish Disease Screening
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Screen live fish specimens in real time for 7 common pathological conditions using in-browser ONNX deep learning inference.
        </p>
      </div>

      {/* Mode Switch Tabs (Camera vs Upload vs Samples) */}
      {!previewImage && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              id="tab-btn-camera"
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-600" />
              <span>Live Camera</span>
            </button>

            <button
              id="tab-btn-upload"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-cyan-600" />
              <span>Upload Photo</span>
            </button>

            <button
              id="tab-btn-samples"
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-cyan-600" />
              <span>Sample Cases</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Specimen Area */}
      <div className="space-y-4">
        {/* Preview State */}
        {previewImage && qualityMetrics ? (
          <div className="space-y-4">
            <div className="relative aspect-video max-w-xl mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm flex items-center justify-center">
              <img
                src={previewImage}
                alt="Captured specimen"
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-700/60">
                Specimen Ready for Analysis
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              <ImageQualityCard
                metrics={qualityMetrics}
                onProceed={handleExecuteInference}
                onRetake={handleRetake}
                isLoading={isAnalyzing}
              />
            </div>
          </div>
        ) : (
          <div>
            {/* Live Camera Tab */}
            {activeTab === 'camera' && (
              <div className="max-w-xl mx-auto space-y-3">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm flex items-center justify-center group">
                  {cameraError ? (
                    <div className="p-6 text-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                      <p className="text-xs text-slate-300 max-w-xs mx-auto">
                        {cameraError}
                      </p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 cursor-pointer"
                      >
                        Switch to File Upload
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* Viewfinder Target Guidelines */}
                      <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                        <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                          <span>AQUASCAN VIEWFINDER</span>
                          <span>224×224 ViT</span>
                        </div>
                        <div className="text-center text-[11px] text-cyan-200/90 font-medium bg-slate-900/50 backdrop-blur-xs px-2 py-0.5 rounded-full self-center">
                          Center fish lateral flank or gill area
                        </div>
                        <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                          <span>FOCUS: ACTIVE</span>
                          <span>WASM SIMD</span>
                        </div>
                      </div>

                      {/* Camera Controls Overlay */}
                      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 z-10">
                        <button
                          id="btn-switch-camera"
                          onClick={handleToggleCamera}
                          title="Switch Camera (Front / Back)"
                          className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-800 border border-slate-700 cursor-pointer transition-transform hover:scale-105"
                        >
                          <SwitchCamera className="w-5 h-5" />
                        </button>

                        <button
                          id="btn-capture-camera"
                          onClick={handleCaptureCamera}
                          className="w-16 h-16 rounded-full bg-white border-4 border-cyan-500 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                          title="Capture Specimen"
                        >
                          <div className="w-11 h-11 rounded-full bg-cyan-600" />
                        </button>

                        <div className="w-11" />
                      </div>
                    </>
                  )}
                </div>

                <p className="text-center text-[11px] text-slate-500">
                  Ensure good tank lighting and steady camera alignment before capturing.
                </p>
              </div>
            )}

            {/* File Upload Tab */}
            {activeTab === 'upload' && (
              <div className="max-w-xl mx-auto">
                <div
                  id="dropzone-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        const img = new Image();
                        img.onload = () => processImageSource(img, dataUrl);
                        img.src = dataUrl;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50/60 hover:bg-cyan-50/30 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>

                  <h3 className="text-base font-bold text-slate-800 mt-4">
                    Upload Fish Specimen Image
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Drag and drop a photo or click to browse files (JPEG, PNG, WebP)
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white group-hover:bg-cyan-600 transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Select Photo</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Cases Tab */}
            {activeTab === 'samples' && (
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="text-center text-xs text-slate-500 mb-2">
                  Select a pre-configured pathology specimen to test model inference immediately:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_FISH_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-500 hover:shadow-sm text-left transition-all flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                        <img
                          src={sample.dataUrl}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-700 transition-colors">
                          {sample.name}
                        </h4>
                        <span className="inline-block text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                          {sample.expectedClass}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {sample.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Protocol Tips */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <span>Keep specimen steady in transparent viewing container</span>
        </div>
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <span>Avoid surface water reflections & bright flash glare</span>
        </div>
        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <span>Capture whole fish with clear view of gills and fins</span>
        </div>
      </div>
    </div>
  );
};
