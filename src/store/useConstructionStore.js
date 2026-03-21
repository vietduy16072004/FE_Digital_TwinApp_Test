import { create } from 'zustand';

export const SHAPE_DEFINITIONS = {
  PILLAR: { name: 'Pillar', geometry: 'BOX', args: [1, 2, 1], color: '#60a5fa' },
  COLUMN: { name: 'Column', geometry: 'CYLINDER', args: [0.25, 0.25, 1.5, 32], color: '#4ade80' },
  BEAM: { name: 'Beam', geometry: 'BOX', args: [3, 0.5, 0.5], color: '#fcd34d' },
  CONE_TRIANGLE: { name: 'Tri-Cone', geometry: 'CONE', args: [0.5, 1, 3], color: '#fb7185' }
};

const useConstructionStore = create((set) => ({
  elements: [],
  selectedElementId: null,
  transformMode: 'translate',

  setTransformMode: (mode) => set({ transformMode: mode }),

  addElement: (type, position = [0, 0.5, 0]) => set((state) => ({
    elements: [...state.elements, { 
      id: Date.now(), 
      ...SHAPE_DEFINITIONS[type], 
      position, 
      rotation: [0, 0, 0] 
    }]
  })),

  // [BỔ SUNG] Hàm xóa một phần tử cụ thể
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),

  selectElement: (id) => set({ selectedElementId: id }),
  deselectElement: () => set({ selectedElementId: null }),

  updateElementPosition: (id, newPosition) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, position: newPosition } : el)
  })),

  updateElementRotation: (id, newRotation) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, rotation: newRotation } : el)
  })),

  resetScene: () => set({ elements: [], selectedElementId: null, transformMode: 'translate' }),
}));

export default useConstructionStore;