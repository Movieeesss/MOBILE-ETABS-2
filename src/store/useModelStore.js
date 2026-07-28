// src/store/useModelStore.js
import { create } from 'zustand';

export const useModelStore = create((set) => ({
  // 1. Grid Definitions
  xSpacing: [4.0, 3.5, 5.0],
  ySpacing: [4.0, 4.0],
  setXSpacing: (newSpacing) => set({ xSpacing: newSpacing }),
  setYSpacing: (newSpacing) => set({ ySpacing: newSpacing }),

  // 2. Stories
  stories: [
    { id: 'Base', elevation: 0 },
    { id: 'Plinth', elevation: 1.5 },
    { id: 'Story 1', elevation: 4.5 }
  ],
  currentStoryId: 'Story 1',
  setCurrentStoryId: (id) => set({ currentStoryId: id }),

  // 3. Properties (Materials & Sections)
  materials: [
    { id: 'M25', type: 'concrete', fck: 25 },
    { id: 'Fe500', type: 'rebar', fy: 500 }
  ],
  sections: [
    { id: 'B_230x350', type: 'beam', b: 0.23, d: 0.35, color: '#22c55e' },
    { id: 'C_450x450', type: 'column', b: 0.45, d: 0.45, color: '#3b82f6' }
  ],
  currentSectionId: 'B_230x350',
  setCurrentSectionId: (id) => set({ currentSectionId: id }),

  // 4. Model Elements
  nodes: [], // { id, x, y, z }
  beams: [], // { id, startNodeId, endNodeId, sectionId }
  columns: [], // { id, startNodeId, endNodeId, sectionId }

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  addBeam: (beam) => set((state) => ({ beams: [...state.beams, beam] })),
  addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
  
  // 5. UI State
  drawMode: 'beam', // 'beam', 'column', 'select'
  setDrawMode: (mode) => set({ drawMode: mode }),
}));
