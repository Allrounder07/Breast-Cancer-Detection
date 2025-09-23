import { ImageQualityResult } from '../types';

/**
 * Simulates a lightweight CNN model to check the quality of an uploaded thermogram.
 * @param file The image file to be analyzed.
 * @returns A promise that resolves to an ImageQualityResult object.
 */
export const checkImageQuality = (file: File): Promise<ImageQualityResult> => {
  return new Promise((resolve) => {
    // Simulate model processing time
    setTimeout(() => {
      const reasons: string[] = [];

      // Simulate 'low signal' check based on file size - further reduced threshold
      if (file.size < 1 * 1024) { // less than 1KB
        reasons.push('Low signal detected');
      }

      // Simulate 'blurry' check with a random chance - reduced probability
      if (Math.random() < 0.02) { // 2% chance
        reasons.push('Blurry image');
      }

      // Simulate 'incorrect orientation' check with a random chance - reduced probability
      if (Math.random() < 0.02) { // 2% chance
        reasons.push('Incorrect orientation');
      }

      if (reasons.length > 0) {
        resolve({ status: 'fail', reasons });
      } else {
        resolve({ status: 'pass', reasons: [] });
      }
    }, 1500); // Shorter delay for the quality check
  });
};