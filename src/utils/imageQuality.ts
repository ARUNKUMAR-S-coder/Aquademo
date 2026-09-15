import { ImageQualityMetrics } from '../types';

export function analyzeImageQuality(canvas: HTMLCanvasElement): ImageQualityMetrics {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      width: canvas.width,
      height: canvas.height,
      brightness: 128,
      contrast: 50,
      sharpnessScore: 100,
      qualityRating: 'Acceptable',
      warnings: ['Could not access canvas context for detailed telemetry.']
    };
  }

  const { width, height } = canvas;
  const sampleWidth = Math.min(width, 320);
  const sampleHeight = Math.min(height, 240);

  let sampleData: ImageData;
  if (width !== sampleWidth || height !== sampleHeight) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sampleWidth;
    tempCanvas.height = sampleHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
    tempCtx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
    sampleData = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  } else {
    sampleData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  }

  const data = sampleData.data;
  const numPixels = sampleWidth * sampleHeight;

  let totalBrightness = 0;
  const grayBuffer = new Uint8ClampedArray(numPixels);

  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    grayBuffer[i] = gray;
    totalBrightness += gray;
  }

  const meanBrightness = Math.round(totalBrightness / numPixels);

  let sumSquaredDiff = 0;
  for (let i = 0; i < numPixels; i++) {
    const diff = grayBuffer[i] - meanBrightness;
    sumSquaredDiff += diff * diff;
  }
  const contrast = Math.round(Math.sqrt(sumSquaredDiff / numPixels));

  let laplacianSum = 0;
  let laplacianCount = 0;
  for (let y = 1; y < sampleHeight - 1; y += 2) {
    for (let x = 1; x < sampleWidth - 1; x += 2) {
      const idx = y * sampleWidth + x;
      const center = grayBuffer[idx];
      const top = grayBuffer[(y - 1) * sampleWidth + x];
      const bottom = grayBuffer[(y + 1) * sampleWidth + x];
      const left = grayBuffer[y * sampleWidth + (x - 1)];
      const right = grayBuffer[y * sampleWidth + (x + 1)];

      const lap = Math.abs(top + bottom + left + right - 4 * center);
      laplacianSum += lap;
      laplacianCount++;
    }
  }

  const sharpnessScore = Math.round((laplacianSum / (laplacianCount || 1)) * 10);

  const warnings: string[] = [];

  if (meanBrightness < 45) {
    warnings.push('Image is severely underexposed. Increase lighting or activate flash.');
  } else if (meanBrightness > 220) {
    warnings.push('Image is overexposed with washed out details. Reduce direct glare.');
  }

  if (contrast < 22) {
    warnings.push('Low contrast detected. Fish specimen lacks separation from aquatic background.');
  }

  if (sharpnessScore < 25) {
    warnings.push('Motion blur or soft focus detected. Hold camera steady close to the fish.');
  }

  if (width < 224 || height < 224) {
    warnings.push('Resolution is below 224x224. ViT upscaling may reduce fine textural fidelity.');
  }

  let qualityRating: 'Optimal' | 'Acceptable' | 'Poor' = 'Optimal';
  if (warnings.length >= 2 || sharpnessScore < 18 || meanBrightness < 30 || meanBrightness > 235) {
    qualityRating = 'Poor';
  } else if (warnings.length === 1 || sharpnessScore < 35 || contrast < 30) {
    qualityRating = 'Acceptable';
  }

  return {
    width,
    height,
    brightness: meanBrightness,
    contrast,
    sharpnessScore,
    qualityRating,
    warnings
  };
}
