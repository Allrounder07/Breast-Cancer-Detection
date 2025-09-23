export interface Hotspot {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  radius: number; // percentage of image width
  intensity: number; // 0 to 1
}

export interface PatientMetadata {
  age?: number;
  sex?: 'Female' | 'Male' | 'Other';
  symptoms?: string;
}

export interface MockAnalysisResult {
  classification: 'Normal' | 'Suspicious';
  confidence: number;
  heatmapData: Hotspot[];
  patientMetadata?: PatientMetadata;
}

export interface AISummary {
  summary: string;
  recommendation: string;
}

export interface AnalysisResult extends MockAnalysisResult {
  id: string;
  imageUrl: string;
  aiSummary: AISummary | null;
}

export interface ImageQualityResult {
  status: 'pass' | 'fail';
  reasons: string[];
}

export interface AppState {
  currentImage: string | null;
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
}