import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer'; // Your existing 3D viewer (to be updated later)
// import PlanCanvas from './components/2DPlanCanvas'; // We will create this next

function App() {
  const [activeTab, setActiveTab] = useState('MODEL'); // MODEL, ASSIGN, ANALYZE, DESIGN
  const [viewport, setViewport] = useState('3D'); // '2D' or '3D'
  const [currentStory, setCurrentStory] = useState('Story 1');
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR (Desktop) / TOP NAV (Mobile) */}
      <div className="w-full md:w-80 bg-slate-900 flex flex-col shadow-xl z-20 border-r border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Mobile-ETABS</h1>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">IS 456:2000 Engine</p>
          </div>
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden bg-slate-800 p-2 rounded text-slate-300"
            onClick={() => setBottomSheetOpen(!isBottomSheetOpen)}
          >
            ☰
          </button>
        </div>

        {/* Viewport Toggles (2D vs 3D) */}
        <div className="p-4 grid grid-cols-2 gap-2 bg-slate-900">
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

        {/* Desktop Controls (Hidden on Mobile unless Bottom Sheet is open) */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isBottomSheetOpen ? 'block absolute bottom-0 left-0 w-full h-[60vh] bg-slate-900 rounded-t-2xl border-t border-slate-700 z-50 p-6' : 'hidden md:block'}`}>
          
          {/* Main Tabs */}
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

          {/* Contextual Tools based on Active Tab */}
          {activeTab === 'MODEL' && (
            <div className="space-y-4 animate-fadeIn">
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

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Draw Elements (2D)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-slate-800 border border-slate-700 p-2 rounded text-sm hover:border-blue-500 hover:text-blue-400 transition-colors">Draw Beam</button>
                  <button className="bg-slate-800 border border-slate-700 p-2 rounded text-sm hover:border-blue-500 hover:text-blue-400 transition-colors">Draw Column</button>
                  <button className="bg-slate-800 border border-slate-700 p-2 rounded text-sm hover:border-blue-500 hover:text-blue-400 transition-colors">Draw Slab</button>
                  <button className="bg-slate-800 border border-slate-700 p-2 rounded text-sm hover:border-red-500 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ASSIGN' && (
            <div className="space-y-4 animate-fadeIn">
               <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Sections & Supports</label>
                <button className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm mb-2 text-left px-4 hover:bg-slate-700">⚙️ Define Frame Sections</button>
                <button className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm mb-2 text-left px-4 hover:bg-slate-700">🔒 Assign Base Supports</button>
                <button className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-left px-4 hover:bg-slate-700">⚖️ Assign Slab Loads</button>
              </div>
            </div>
          )}

          {activeTab === 'ANALYZE' && (
            <div className="space-y-4 animate-fadeIn">
              <button className="w-full bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 p-3 rounded-lg text-sm font-bold hover:bg-yellow-600/30 transition-colors">
                1. Check Model
              </button>
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors">
                2. Run Analysis & Design
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
          <div className="flex items-center justify-center h-full text-slate-500 border-4 border-dashed border-slate-800 m-4 rounded-xl">
             {/* <PlanCanvas /> will be mounted here */}
             <p>2D Plan Canvas Mounting Point (Story: {currentStory})</p>
          </div>
        )}
        
        {/* Validation / Status Toast */}
        <div className="absolute top-4 right-4 bg-emerald-900/80 text-emerald-400 px-4 py-2 rounded-md border border-emerald-800 text-xs shadow-lg backdrop-blur-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready to model
        </div>

      </div>

      {/* Mobile Bottom Sheet Overlay trigger */}
      {isBottomSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setBottomSheetOpen(false)}
        ></div>
      )}

    </div>
  );
}

export default App;
