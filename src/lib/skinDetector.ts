/**
 * Offline skin image validator using canvas pixel analysis.
 * Detects whether an image likely contains skin by analyzing
 * skin-tone pixel distribution using HSV color space heuristics.
 *
 * Confidence threshold: 60% — images below this are rejected.
 */

interface SkinAnalysisResult {
  isSkinImage: boolean;
  confidence: number;
  message: string;
}

/**
 * Checks if an RGB pixel falls within typical skin-tone ranges.
 * Uses multiple color-space rules for better accuracy across skin tones.
 */
function isSkinPixel(r: number, g: number, b: number): boolean {
  // Rule 1: RGB-based skin detection (works for lighter skin tones)
  const rgbRule =
    r > 95 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 15 &&
    (Math.max(r, g, b) - Math.min(r, g, b)) > 15;

  // Rule 2: Normalized RGB ratio (works across more skin tones)
  const total = r + g + b;
  if (total === 0) return false;
  const nr = r / total;
  const ng = g / total;
  const ratioRule =
    nr > 0.3 && nr < 0.6 &&
    ng > 0.2 && ng < 0.4 &&
    nr > ng;

  // Rule 3: HSV-based detection for darker skin tones
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  const v = max / 255;

  const hsvRule =
    h >= 0 && h <= 50 &&
    s >= 0.1 && s <= 0.75 &&
    v >= 0.15;

  return rgbRule || (ratioRule && hsvRule);
}

/**
 * Analyzes an image data URL and determines if it contains skin.
 * Returns a structured result with confidence score.
 */
export function analyzeSkinImage(imageDataUrl: string): Promise<SkinAnalysisResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Resize for performance (analyze at 224x224 like MobileNetV2 spec)
      const size = 224;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve({
          isSkinImage: false,
          confidence: 0,
          message: "Unable to process image. Please try another image.",
        });
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;
      const totalPixels = size * size;

      let skinPixels = 0;
      let nonBlankPixels = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent/near-transparent pixels
        if (a < 128) continue;

        // Skip pure white/black (blank image detection)
        if ((r > 250 && g > 250 && b > 250) || (r < 5 && g < 5 && b < 5)) continue;

        nonBlankPixels++;
        if (isSkinPixel(r, g, b)) {
          skinPixels++;
        }
      }

      // Blank image check
      if (nonBlankPixels < totalPixels * 0.1) {
        resolve({
          isSkinImage: false,
          confidence: 0,
          message: "No skin disease detected. Please upload a valid skin image.",
        });
        return;
      }

      // Calculate skin percentage relative to non-blank pixels
      const skinPercentage = (skinPixels / nonBlankPixels) * 100;

      // Map skin percentage to confidence (0-100)
      // 20%+ skin pixels = high confidence, <5% = very low
      let confidence: number;
      if (skinPercentage >= 30) confidence = 85 + Math.min(15, (skinPercentage - 30) / 4);
      else if (skinPercentage >= 20) confidence = 70 + (skinPercentage - 20) * 1.5;
      else if (skinPercentage >= 10) confidence = 50 + (skinPercentage - 10) * 2;
      else confidence = skinPercentage * 5;

      confidence = Math.round(Math.min(100, Math.max(0, confidence)));

      const THRESHOLD = 60;

      if (confidence >= THRESHOLD) {
        resolve({
          isSkinImage: true,
          confidence,
          message: `Skin region detected with ${confidence}% confidence.`,
        });
      } else {
        resolve({
          isSkinImage: false,
          confidence,
          message: "No skin disease detected. Please upload a valid skin image.",
        });
      }
    };

    img.onerror = () => {
      resolve({
        isSkinImage: false,
        confidence: 0,
        message: "Unable to process image. Please try another image.",
      });
    };

    img.src = imageDataUrl;
  });
}
