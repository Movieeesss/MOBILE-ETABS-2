import { create } from 'zustand';

export const useModelStore = create((set) => ({
  // ETABS Style Grid Spacings (Default)
  xSpacing: [4.0, 3.5, 5.0],
  ySpacing: [4.0, 4.0],
  
  // Actions to update grids
  setXSpacing: (newSpacing) => set({ xSpacing: newSpacing }),
  setYSpacing: (newSpacing) => set({ ySpacing: newSpacing }),
}));
