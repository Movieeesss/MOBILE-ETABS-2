import { create } from 'zustand';

export const useModelStore = create((set) => ({
  loadCase: 'DEAD',
  resultType: 'undeformed',
  showColumns: true,
  showBeams: true,
  showSlabs: true,
  deformationScale: 50,
  diagramScale: 0.05,
  
  setLoadCase: (loadCase) => set({ loadCase }),
  setResultType: (resultType) => set({ resultType }),
  toggleColumns: () => set((state) => ({ showColumns: !state.showColumns })),
  toggleBeams: () => set((state) => ({ showBeams: !state.showBeams })),
  toggleSlabs: () => set((state) => ({ showSlabs: !state.showSlabs })),
  setDeformationScale: (scale) => set({ deformationScale: scale }),
  setDiagramScale: (scale) => set({ diagramScale: scale }),
}));