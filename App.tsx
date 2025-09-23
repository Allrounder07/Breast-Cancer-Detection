import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { Loader } from './components/Loader';
import { LogoIcon } from './components/Icons';
import { AnalysisResult, AppState } from './types';
import { runMockAnalysis } from './services/mockAnalysisService';
import { getAISummary } from './services/geminiService';
import { checkImageQuality } from './services/imageQualityService';
import { storage } from './utils/storage';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentImage: null,
    currentAnalysis: null,
    history: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const storedHistory = storage.get<AnalysisResult[]>('thermoScanHistory', []);
    setAppState(prevState => ({ ...prevState, history: storedHistory }));
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setAppState(prevState => ({ ...prevState, isLoading: true, error: null, currentAnalysis: null, currentImage: imageUrl }));

    try {
      // 1. Perform image quality check
      const qualityResult = await checkImageQuality(file);

      if (qualityResult.status === 'fail') {
        const errorReason = `Image quality check failed: ${qualityResult.reasons.join(', ')}.`;
        throw new Error(errorReason);
      }

      // 2. Proceed with main analysis if quality check passes
      const mockResult = await runMockAnalysis(file);
      const aiSummary = await getAISummary(mockResult);

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        imageUrl: imageUrl,
        ...mockResult,
        aiSummary,
      };

      setAppState(prevState => {
        const updatedHistory = [newAnalysis, ...prevState.history];
        storage.set('thermoScanHistory', updatedHistory);
        
        return {
          ...prevState,
          currentAnalysis: newAnalysis,
          history: updatedHistory,
          isLoading: false,
        };
      });

    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setAppState(prevState => ({ ...prevState, isLoading: false, error: errorMessage, currentAnalysis: null }));
    }
  }, []);

  const handleSelectHistory = useCallback((analysis: AnalysisResult) => {
    setAppState(prevState => ({
      ...prevState,
      currentImage: analysis.imageUrl,
      currentAnalysis: analysis,
      error: null,
    }));
  }, []);
  
  const handleDeleteHistory = useCallback((id: string) => {
     setAppState(prevState => {
        const updatedHistory = prevState.history.filter(item => item.id !== id);
        storage.set('thermoScanHistory', updatedHistory);

        let newCurrentAnalysis = prevState.currentAnalysis;
        let newCurrentImage = prevState.currentImage;

        if (prevState.currentAnalysis?.id === id) {
          newCurrentAnalysis = null;
          newCurrentImage = null;
        }

        return {
          ...prevState,
          history: updatedHistory,
          currentAnalysis: newCurrentAnalysis,
          currentImage: newCurrentImage,
        };
      });
  }, []);

  const { currentImage, currentAnalysis, history, isLoading, error } = appState;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex items-center justify-between pb-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              ThermoScan AI
            </h1>
          </div>
        </header>

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Thermogram</h2>
              <p className="text-slate-400 mb-6">
                Select or drag and drop a thermographic image for analysis. The AI will process the image to identify potential anomalies.
              </p>
              <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                <p className="font-semibold">Analysis Error</p>
                <p>{error}</p>
              </div>
            )}

            {isLoading && <Loader />}
            
            {currentAnalysis && !isLoading && (
              <AnalysisResultDisplay result={currentAnalysis} />
            )}

             {!isLoading && !currentAnalysis && currentImage && !error && (
                 <div className="bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-700 text-center flex flex-col items-center justify-center min-h-[400px]">
                     <img src={currentImage} alt="Uploaded for analysis" className="max-h-[300px] rounded-lg mb-4" />
                     <p className="text-slate-400 text-lg">Ready for analysis.</p>
                 </div>
             )}

             {!isLoading && !currentAnalysis && !currentImage && !error && (
              <div className="bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-700 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <p className="text-slate-400 text-lg">Your analysis results will appear here.</p>
                  <p className="text-slate-500 mt-2">Upload an image to begin.</p>
              </div>
            )}
            
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel 
              history={history} 
              onSelect={handleSelectHistory} 
              onDelete={handleDeleteHistory}
              currentAnalysisId={currentAnalysis?.id}
            />
          </div>
        </main>
         <footer className="text-center mt-12 py-6 border-t border-slate-700 text-slate-500 text-sm">
            <p className="font-semibold text-amber-400">Disclaimer:</p>
            <p>ThermoScan AI is a research prototype and not a medical device. Analysis results are for informational purposes only and should not be used for diagnosis. Always consult a qualified healthcare professional for medical advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
