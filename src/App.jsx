import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer';
import PlanCanvas from './components/PlanCanvas'; // Correctly imported 2D Canvas
import { useModelStore } from './store/useModelStore';

function App() {
  const [activeTab, setActiveTab] = useState('MODEL');
  const [viewport, setViewport] = useState('3D');
  const [currentStory, setCurrentStory] = useState('Story 1');
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  // Zustand Store for Dynamic Grids
  const { xSpacing, ySpacing, setXSpacing, setYSpacing } = useModelStore();

  // Helper to handle grid input changes (ETABS Style comma separated)
  const handleGridChange = (axis, value) => {
    const newGrids = value.split(',').map(val => parseFloat(val.trim()) || 0);
    if (axis === 'X') setXSpacing(newGrids);
    if (axis === 'Y') setYSpacing(newGrids);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-80 bg-slate-900 flex flex-col shadow-xl z-20 border-r border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Mobile-ETABS</h1>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">IS 456:2000 Engine</p>
          </div>
          <button 
            className="md:hidden bg-slate-800 p-2 rounded text-slate-300"
            onClick={() => setBottomSheetOpen(!isBottomSheetOpen)}
          >
            ☰
          </button>
        </div>

        {/* Viewport Toggles */}
        <div className="p-4 grid grid-cols-2 gap-2 bg-slate-900 border-b border-slate-800">
          <button 
            onClick={() => setViewport('2D')}
            className={`py-2 text-sm font-semibold rounded ${viewport === '2D' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            2D PLAN
          </button>
          <button 
            onClick={() => setViewport('3D')}
            className={`py-2 text-sm font-semibold rounded ${viewport === '3D' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            3D VIEW
          </button>
        </div>

        {/* Controls */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isBottomSheetOpen ? 'block absolute bottom-0 left-0 w-full h-[70vh] bg-slate-900 rounded-t-2xl border-t border-slate-700 z-50 p-6' : 'hidden md:block'}`}>
          
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg">
            {['MODEL', 'ASSIGN', 'ANALYZE'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md ${activeTab === tab ? 'bg-slate-800 text-blue-400' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'MODEL' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* ETABS Grid Spacing Manager */}
              <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <span>📐</span> Edit Grid Data (Spacing)
                </label>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase">X-Grid Spacing (m)</label>
                  <input 
                    type="text" 
                    value={xSpacing.join(', ')} 
                    onChange={(e) => handleGridChange('X', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500 mt-1"
                    placeholder="e.g. 4, 3.5, 5"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase">Y-Grid Spacing (m)</label>
                  <input 
                    type="text" 
                    value={ySpacing.join(', ')} 
                    onChange={(e) => handleGridChange('Y', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500 mt-1"
                    placeholder="e.g. 4, 4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Current Story</label>
                <select 
                  value={currentStory} 
                  onChange={(e) => setCurrentStory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Plinth">Plinth (Z = 1.5m)</option>
                  <option value="Story 1">Story 1 (Z = 4.5m)</option>
                </select>
              </div>

            </div>
          )}

          {activeTab === 'ASSIGN' && (
            <div className="space-y-4 animate-fadeIn">
               <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Sections & Supports</label>
                <button className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm mb-2 text-left px-4 hover:bg-slate-700">⚙️ Define Frame Sections</button>
                <button className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm mb-2 text-left px-4 hover:bg-slate-700">🔒 Assign Base Supports</button>
              </div>
            </div>
          )}

          {activeTab === 'ANALYZE' && (
             <div className="space-y-4 animate-fadeIn">
               <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors">
                 Run Analysis & Design
               </button>
             </div>
          )}

        </div>
      </div>

      {/* MAIN CANVAS AREA */}
      <div className="flex-1 relative cursor-crosshair bg-slate-950">
        
        {viewport === '3D' ? (
          <ModelViewer /> 
        ) : (
          <PlanCanvas currentStory={currentStory} />
        )}
        
      </div>
    </div>
  );
}

export default App;
