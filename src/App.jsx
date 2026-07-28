import React from 'react';
import ModelViewer from './components/ModelViewer';
import { useModelStore } from './store/useModelStore';

function App() {
  const {
    loadCase, setLoadCase,
    resultType, setResultType,
    showColumns, toggleColumns,
    showBeams, toggleBeams,
    showSlabs, toggleSlabs
  } = useModelStore();

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 p-6 flex flex-col gap-6 shadow-xl z-10 border-r border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Structural Viewer</h1>
          <p className="text-xs text-slate-400">PWA Model & Results Inspector</p>
        </div>

        {/* Load Cases */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Load Case</label>
          <select 
            value={loadCase} 
            onChange={(e) => setLoadCase(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="DEAD">DEAD</option>
            <option value="LIVE">LIVE</option>
          </select>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Visibility</label>
          <div className="flex items-center justify-between">
            <span className="text-sm">Columns</span>
            <input type="checkbox" checked={showColumns} onChange={toggleColumns} className="accent-blue-500 w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Beams</span>
            <input type="checkbox" checked={showBeams} onChange={toggleBeams} className="accent-blue-500 w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Slabs</span>
            <input type="checkbox" checked={showSlabs} onChange={toggleSlabs} className="accent-blue-500 w-4 h-4" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Results Viewer</label>
          <div className="grid grid-cols-2 gap-2">
            {['undeformed', 'deformed', 'axial', 'shear2_2', 'moment3_3'].map((type) => (
              <button
                key={type}
                onClick={() => setResultType(type)}
                className={`py-2 px-2 text-xs rounded border capitalize transition-colors ${
                  resultType === type 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <ModelViewer />
        
        {/* On-screen Legend */}
        <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700 text-xs shadow-lg">
          <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Columns</div>
          <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Beams</div>
          <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 bg-slate-400 opacity-50 rounded-sm"></div> Slabs</div>
          {resultType === 'moment3_3' && <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-700"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Moment Diagram</div>}
        </div>
      </div>
    </div>
  );
}

export default App;