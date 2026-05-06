import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/clients';

/**
 * useAuthStore - Quản lý trạng thái người dùng, Token và các tác vụ Auth
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Hàm Đăng ký
      register: async (fullName, email, password) => {
        set({ loading: true, error: null });
        try {
          await apiClient.post('/auth/register', { fullName, email, password });
          set({ loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Đăng ký thất bại';
          set({ error: Array.isArray(message) ? message[0] : message, loading: false });
          return { success: false };
        }
      },

      // Hàm Đăng nhập
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          const { accessToken, userId, email: userEmail, roles } = response.data;
          
          set({ 
            accessToken, 
            user: { id: userId, email: userEmail, roles: roles || ['USER'] }, 
            isAuthenticated: true, 
            loading: false 
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Email hoặc mật khẩu không đúng';
          set({ error: Array.isArray(message) ? message[0] : message, loading: false });
          return { success: false };
        }
      },

      // Lấy Profile (Dựa trên profile.dto.ts)
      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;
        set({ loading: true });
        try {
          const response = await apiClient.get(`/auth/profile/${user.id}`);
          set({ user: { ...user, ...response.data }, loading: false });
        } catch (err) {
          console.error("Lỗi lấy Profile:", err);
          set({ loading: false });
        }
      },

      /**
       * Hàm Đổi mật khẩu
       * ĐÃ SỬA: Chỉ gửi currentPassword và newPassword vào Body.
       * * Giải thích: Dựa trên ChangePasswordDto tại Gateway, chỉ có 2 trường này được phép.
       * Các trường userId, requesterUserId, requesterRoles sẽ được Gateway Controller
       * tự động lấy từ JWT Token và truyền xuống Microservice, chúng ta không gửi từ FE.
       */
      changePassword: async (currentPassword, newPassword) => {
        const { user } = get();
        if (!user) return { success: false };
        
        set({ loading: true, error: null });
        try {
          // Chỉ gửi dữ liệu khớp với Whitelist của ChangePasswordDto ở Gateway
          await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword
          });
          set({ loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Đổi mật khẩu thất bại';
          set({ error: Array.isArray(message) ? message[0] : message, loading: false });
          return { success: false };
        }
      },

      // Hàm Đăng xuất
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;