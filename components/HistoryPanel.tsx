
import React from 'react';
import { AnalysisResult } from '../types';
import { TrashIcon, CheckCircleIcon, AlertTriangleIcon } from './Icons';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onSelect: (analysis: AnalysisResult) => void;
  onDelete: (id: string) => void;
  currentAnalysisId?: string | null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete, currentAnalysisId }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Analysis History</h2>
      {history.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          <p>No past analyses found.</p>
          <p className="text-sm mt-1">Your processed images will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-2">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer group ${
                  currentAnalysisId === item.id ? 'bg-cyan-900/50 border-cyan-700 shadow-md' : 'bg-slate-900/60 hover:bg-slate-800/80 border-transparent'
              } border`}
            >
              <img src={item.imageUrl} alt="thumbnail" className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="text-base font-semibold text-slate-100 truncate">
                  Analysis #{item.id.substring(0, 5)}
                </p>
                <div className={`flex items-center text-sm mt-1.5 ${item.classification === 'Suspicious' ? 'text-amber-400' : 'text-green-400'}`}>
                    {item.classification === 'Suspicious' ? <AlertTriangleIcon className="w-4 h-4 mr-1.5"/> : <CheckCircleIcon className="w-4 h-4 mr-1.5"/>}
                    <span className="font-medium">{item.classification}</span>
                    <span className="text-slate-400 ml-1.5">({(item.confidence * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="ml-4 p-2 rounded-full text-slate-500 hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Delete analysis"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
