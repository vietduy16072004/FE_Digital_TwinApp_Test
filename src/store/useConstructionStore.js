import { create } from 'zustand';
import apiClient from '../api/clients';

/**
 * useConstructionStore - Quản lý Element & Element Detail
 * Đồng bộ trực tiếp với Element Service và Element Detail Service
 */
const useConstructionStore = create((set, get) => ({
  elements: [],
  selectedElementId: null,
  currentDetails: [], 
  transformMode: 'translate',
  loading: false,

  // --- ELEMENT SERVICE ---
  fetchElements: async (projectId) => {
    if (!projectId) return;
    set({ loading: true });
    try {
      const response = await apiClient.get(`/projects/${projectId}/elements`);
      set({ elements: response.data.data || [], loading: false });
    } catch (err) {
      console.error("Lỗi fetch elements:", err);
      set({ loading: false });
    }
  },

  addElement: async (projectId, type) => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/elements`, {
        name: `New ${type}`,
        type: type,
        posX: 0, posY: 0.5, posZ: 0,
        rotX: 0, rotY: 0, rotZ: 0
      });
      const newEl = response.data.data;
      set(state => ({ elements: [...state.elements, newEl] }));
      return newEl;
    } catch (err) {
      console.error("Lỗi tạo element:", err);
    }
  },

  updateTransform: async (elementId, pos, rot) => {
    // Cập nhật local trước để UI mượt (Optimistic)
    set(state => ({
      elements: state.elements.map(el => 
        el.id === elementId ? { 
          ...el, 
          transform: { 
            position: { x: pos[0], y: pos[1], z: pos[2] },
            rotation: { x: rot[0], y: rot[1], z: rot[2] }
          } 
        } : el
      )
    }));

    try {
      await apiClient.put(`/elements/${elementId}`, {
        posX: pos[0], posY: pos[1], posZ: pos[2],
        rotX: rot[0], rotY: rot[1], rotZ: rot[2]
      });
    } catch (err) {
      console.error("Lỗi sync transform:", err);
    }
  },

  // --- ELEMENT DETAIL SERVICE ---
  fetchElementDetails: async (elementId) => {
    try {
      const response = await apiClient.get(`/elements/${elementId}/details`);
      set({ currentDetails: response.data.data || [] });
    } catch (err) {
      console.error("Lỗi fetch details:", err);
    }
  },

  // Tương ứng @Post('elements/:elementId/details')
  createElementDetail: async (elementId, data) => {
    try {
      await apiClient.post(`/elements/${elementId}/details`, {
        faceName: data.faceName,
        materialId: data.materialId,
        localPosX: 0, localPosY: 0, localPosZ: 0,
        scale: data.scale || 1,
        args: {}
      });
      get().fetchElementDetails(elementId);
    } catch (err) {
      console.error("Lỗi thêm chi tiết mặt:", err);
    }
  },

  setTransformMode: (mode) => set({ transformMode: mode }),
  selectElement: (id) => {
    set({ selectedElementId: id });
    if (id) get().fetchElementDetails(id);
    else set({ currentDetails: [] });
  },
}));

export default useConstructionStore;