import { MockAnalysisResult, Hotspot, PatientMetadata } from '../types';

// This function simulates a complex analysis by a backend model.
export const runMockAnalysis = (
  file: File,
  patientMetadata?: PatientMetadata
): Promise<MockAnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate network delay and processing time
    setTimeout(() => {
      // Simple logic to determine outcome for demonstration purposes.
      // E.g., based on file size or a random factor.
      const isSuspicious = Math.random() > 0.4;
      
      const hotspots: Hotspot[] = [];
      if (isSuspicious) {
        const numHotspots = Math.floor(Math.random() * 3) + 1; // 1 to 3 hotspots
        for (let i = 0; i < numHotspots; i++) {
          hotspots.push({
            x: Math.random() * 60 + 20, // Center hotspots, avoiding edges
            y: Math.random() * 60 + 20,
            radius: Math.random() * 15 + 10, // Radius as % of image width
            intensity: Math.random() * 0.5 + 0.5, // 0.5 to 1.0 intensity
          });
        }
      }

      const result: MockAnalysisResult = {
        classification: isSuspicious ? 'Suspicious' : 'Normal',
        confidence: isSuspicious ? 0.85 + Math.random() * 0.14 : 0.95 + Math.random() * 0.04, // e.g., 0.85-0.99 for suspicious, 0.95-0.99 for normal
        heatmapData: hotspots,
        patientMetadata,
      };
      
      resolve(result);
    }, 4000 + Math.random() * 2000); // Wait 4-6 seconds
  });
};