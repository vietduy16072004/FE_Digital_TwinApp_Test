import { create } from 'zustand';

export const SHAPE_DEFINITIONS = {
  PILLAR: { name: 'Pillar', geometry: 'BOX', args: [1, 2, 1], color: '#60a5fa' },
  COLUMN: { name: 'Column', geometry: 'CYLINDER', args: [0.25, 0.25, 1.5, 32], color: '#4ade80' },
  BEAM: { name: 'Beam', geometry: 'BOX', args: [3, 0.5, 0.5], color: '#fcd34d' },
  CONE_TRIANGLE: { name: 'Tri-Cone', geometry: 'CONE', args: [0.5, 1, 3], color: '#fb7185' }
};

export const MATERIAL_DEFINITIONS = {
  STEEL: { name: 'Steel', color: '#94a3b8', metalness: 0.9, roughness: 0.1 },
  WOOD: { name: 'Wood', color: '#a36a3e', metalness: 0.0, roughness: 0.8 },
  CONCRETE: { name: 'Concrete', color: '#71717a', metalness: 0.0, roughness: 0.9 },
  PLASTIC: { name: 'Plastic', color: '#3b82f6', metalness: 0.3, roughness: 0.4 }
};

const useConstructionStore = create((set) => ({
  elements: [],
  selectedElementId: null,
  transformMode: 'translate',
  currentMaterialId: 'STEEL',

  setTransformMode: (mode) => set({ transformMode: mode }),
  setCurrentMaterial: (id) => set({ currentMaterialId: id }),

  addElement: (type, position = [0, 0.5, 0]) => set((state) => ({
    elements: [...state.elements, { 
      id: Date.now(), 
      ...SHAPE_DEFINITIONS[type], 
      position, 
      rotation: [0, 0, 0],
      materialId: state.currentMaterialId 
    }]
  })),

  // Chức năng nhân bản (Duplicate) - Task 6 Phase 2
  duplicateElement: (id) => set((state) => {
    const original = state.elements.find(el => el.id === id);
    if (!original) return state;
    
    const newElement = {
      ...original,
      id: Date.now(),
      // Dịch chuyển nhẹ để người dùng thấy khối mới tạo
      position: [original.position[0] + 0.5, original.position[1], original.position[2] + 0.5]
    };
    
    return {
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id
    };
  }),

  selectElement: (id) => set({ selectedElementId: id }),
  deselectElement: () => set({ selectedElementId: null }),

  updateElementPosition: (id, newPosition) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, position: newPosition } : el)
  })),

  updateElementRotation: (id, newRotation) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, rotation: newRotation } : el)
  })),

  updateElementMaterial: (id, materialId) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, materialId } : el)
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),

  resetScene: () => set({ elements: [], selectedElementId: null, transformMode: 'translate' }),
}));

export default useConstructionStore;