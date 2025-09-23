import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon } from './Icons';
import { Heatmap } from './Heatmap';
import { ConfidenceDonut } from './ConfidenceDonut';
import { Tooltip } from './Tooltip';


interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}


export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  const isSuspicious = result.classification === 'Suspicious';

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">Analysis Result</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">Original Image</h3>
            <img src={result.imageUrl} alt="Original Thermogram" className="rounded-lg w-full object-cover aspect-square" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">AI Heatmap</h3>
            <Heatmap
              imageUrl={result.imageUrl}
              heatmapData={result.heatmapData}
              className="rounded-lg w-full object-cover aspect-square"
            />
          </div>
        </div>

        {/* Right Column: Data */}
        <div className="space-y-6">

          {/* Key Findings Card */}
          <div className="bg-slate-900/70 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Key Findings</h3>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
              
              {/* Classification */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                   <h4 className="text-sm font-medium text-slate-400">Classification</h4>
                   <Tooltip text="This is the AI's classification of the thermogram. 'Suspicious' indicates potential anomalies requiring further review.">
                       <InfoIcon className="w-4 h-4 text-slate-500 cursor-help" />
                   </Tooltip>
                </div>
                <div className={`flex items-center gap-3 mt-2 p-3 rounded-lg ${isSuspicious ? 'bg-amber-900/20 text-amber-400' : 'bg-green-900/20 text-green-400'}`}>
                    {isSuspicious ? <AlertTriangleIcon className="w-8 h-8"/> : <CheckCircleIcon className="w-8 h-8"/>}
                    <p className="text-2xl sm:text-3xl font-bold">{result.classification}</p>
                </div>
              </div>

              <div className="w-full sm:w-px sm:h-24 bg-slate-700"></div>

              {/* Confidence Score */}
               <div className="flex flex-col items-center">
                 <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-slate-400">Confidence</h4>
                     <Tooltip text="Represents the AI's confidence in its classification, from 0% to 100%. Higher scores indicate greater certainty.">
                        <InfoIcon className="w-4 h-4 text-slate-500 cursor-help" />
                    </Tooltip>
                </div>
                <ConfidenceDonut confidence={result.confidence} isSuspicious={isSuspicious} />
              </div>
            </div>
          </div>


          <div className="bg-slate-900/70 p-4 rounded-lg">
             <h3 className="text-lg font-semibold text-white mb-3">AI Summary & Recommendation</h3>
            {result.aiSummary ? (
              <div className="space-y-4 text-slate-300">
                <div>
                    <h4 className="font-semibold text-slate-400 mb-1 text-sm">Summary:</h4>
                    <p className="text-sm leading-relaxed">{result.aiSummary.summary}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-400 mb-1 text-sm">Recommendation:</h4>
                    <p className="text-sm leading-relaxed">{result.aiSummary.recommendation}</p>
                </div>
              </div>
            ) : (
                <p className="text-slate-400 text-sm">AI summary could not be generated.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
