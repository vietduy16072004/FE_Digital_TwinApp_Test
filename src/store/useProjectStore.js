import { create } from 'zustand';
import apiClient from '../api/clients';

/**
 * useProjectStore - Quản lý logic Dự án
 * Tối ưu hóa trạng thái loading để hiển thị hiệu ứng trên UI
 */
const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/projects', { 
        params: { page: 1, limit: 50, search: '' } 
      });
      const projectList = response.data.data || [];
      set({ projects: projectList, loading: false });
    } catch (err) {
      set({ error: 'Không thể tải danh sách dự án', loading: false });
    }
  },

  createProject: async (name, description) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/projects', { 
        name, 
        description, 
        environment: {} 
      });
      // Giả lập delay 800ms để người dùng thấy hiệu ứng loading chuyên nghiệp
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newProject = response.data.data;
      set((state) => ({ 
        projects: [newProject, ...state.projects], 
        loading: false 
      }));
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, error: err.response?.data?.message };
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true });
    try {
      // Giả lập delay xóa
      await new Promise(resolve => setTimeout(resolve, 600));
      set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        loading: false
      }));
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false };
    }
  },

  selectProject: (project) => {
    set({ currentProject: project });
  }
}));

export default useProjectStore;