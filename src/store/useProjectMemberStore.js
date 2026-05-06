import { create } from 'zustand';
import apiClient from '../api/clients';

/**
 * Store dành riêng cho Project Member Service.
 * Quản lý danh sách thành viên và các thao tác phân quyền.
 */
const useProjectMemberStore = create((set, get) => ({
  members: [],
  loading: false,
  error: null,

  // Lấy danh sách thành viên của một dự án cụ thể
  // Endpoint: GET /api/projects/:projectId/members
  fetchMembers: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/projects/${projectId}/members`);
      // Cấu trúc response thường là response.data.data (nếu BE bọc trong field data)
      set({ members: response.data.data || response.data || [], loading: false });
    } catch (err) {
      set({ error: 'Không thể tải danh sách thành viên', loading: false });
    }
  },

  // Thêm thành viên mới vào dự án
  // Endpoint: POST /api/projects/:projectId/members
  addMember: async (projectId, userId, projectRole = 'VIEWER') => {
    set({ loading: true });
    try {
      await apiClient.post(`/projects/${projectId}/members`, {
        userId,
        projectRole
      });
      // Tải lại danh sách sau khi thêm thành công
      await get().fetchMembers(projectId);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Thêm thành viên thất bại';
      set({ loading: false });
      return { success: false, error: msg };
    }
  },

  // Cập nhật vai trò của thành viên
  // Endpoint: PATCH /api/projects/:projectId/members/:userId/role
  updateMemberRole: async (projectId, userId, projectRole) => {
    try {
      await apiClient.patch(`/projects/${projectId}/members/${userId}/role`, {
        projectRole
      });
      // Cập nhật local state để UI phản hồi ngay lập tức
      set((state) => ({
        members: state.members.map((m) => 
          m.userId === userId ? { ...m, projectRole } : m
        )
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // Xóa thành viên khỏi dự án
  // Endpoint: DELETE /api/projects/:projectId/members/:userId
  removeMember: async (projectId, userId) => {
    try {
      await apiClient.delete(`/projects/${projectId}/members/${userId}`);
      set((state) => ({
        members: state.members.filter((m) => m.userId !== userId)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}));

export default useProjectMemberStore;