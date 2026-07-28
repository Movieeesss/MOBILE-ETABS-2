// ... inside App.jsx -> activeTab === 'MODEL' block

          {activeTab === 'MODEL' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Grid Spacing Manager (Same as before) */}
              <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {/* ... existing grid inputs ... */}
              </div>

              {/* Story Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Current Story</label>
                <select 
                  value={useModelStore(state => state.currentStoryId)} 
                  onChange={(e) => useModelStore.getState().setCurrentStoryId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {useModelStore(state => state.stories).map(story => (
                    <option key={story.id} value={story.id}>{story.id} (Z = {story.elevation}m)</option>
                  ))}
                </select>
              </div>

              {/* Draw Tools */}
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-400 uppercase">Draw Elements (2D)</label>
                 <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => useModelStore.getState().setDrawMode('beam')}
                     className={`p-2 rounded text-sm transition-colors border ${useModelStore(state => state.drawMode) === 'beam' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                   >
                     Draw Beam
                   </button>
                   <button 
                     onClick={() => useModelStore.getState().setDrawMode('column')}
                     className={`p-2 rounded text-sm transition-colors border ${useModelStore(state => state.drawMode) === 'column' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                   >
                     Draw Column
                   </button>
                 </div>
              </div>

            </div>
          )}
