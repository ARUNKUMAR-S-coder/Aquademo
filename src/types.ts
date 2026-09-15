export type AppView = 'screen' | 'result' | 'history' | 'diseases' | 'about';

export interface DiseaseInfo {
  id: number;
  name: string;
  commonName: string;
  scientificCategory: 'Bacterial' | 'Fungal' | 'Viral' | 'Parasitic' | 'Healthy';
  severity: 'healthy' | 'moderate' | 'high' | 'critical';
  shortDescription: string;
  pathogen: string;
  clinicalSigns: string[];
  immediateActions: string[];
  treatmentOptions: string[];
  waterQualityFocus: string[];
}

export interface PredictionClassProb {
  classId: number;
  className: string;
  probability: number;
  percentage: number;
}

export interface ImageQualityMetrics {
  width: number;
  height: number;
  brightness: number; // 0 - 255
  contrast: number; // Standard deviation of luminance
  sharpnessScore: number; // Laplacian variance
  qualityRating: 'Optimal' | 'Acceptable' | 'Poor';
  warnings: string[];
}

export interface ScreeningResult {
  id: string;
  timestamp: number;
  primaryClassId: number;
  primaryClassName: string;
  primaryProbability: number;
  probabilities: PredictionClassProb[];
  rawLogits: number[];
  inferenceTimeMs: number;
  imageThumbnail: string; // Base64 dataUrl
  deviceType: string;
  qualityMetrics: ImageQualityMetrics;
  saliencyMapUrl?: string; // Occlusion heatmap
}
