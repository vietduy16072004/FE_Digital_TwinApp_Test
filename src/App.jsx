import React, { useState, useEffect } from 'react';
import MainCanvas from './components/canvas/MainCanvas.jsx';
import ConstructionPanel from './components/ui/ConstructionPanel.jsx';
import AuthPage from './components/auth/AuthPage.jsx';
import ProfilePage from './components/auth/ProfilePage.jsx';
import ProjectDashboard from './components/project/ProjectDashboard.jsx';
// Đường dẫn chính xác theo cấu trúc thư mục thực tế của bạn (có dấu cách)
import ProjectMemberPage from './components/project members/ProjectMemberPage.jsx'; 
import useAuthStore from './store/useAuthStore.js';
import useProjectStore from './store/useProjectStore.js';
import useConstructionStore from './store/useConstructionStore.js';
import { LogOut, User as UserIcon, Briefcase, LayoutGrid, Box } from 'lucide-react';
import './App.css';

/**
 * App Component - Hệ thống điều phối luồng Digital Twin hoàn chỉnh.
 * Đã sửa lỗi giao diện Canvas nhỏ, lỗi vòng lặp render và phân tách luồng nghiệp vụ.
 */
function App() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const { currentProject, selectProject } = useProjectStore();
  const { fetchElements } = useConstructionStore();
  
  // 1. Quản lý Chế độ hiển thị (View) & Ghi nhớ trạng thái (Persistence)
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('wisdom_dt_view') || 'projects';
  });

  // Ghi nhớ dự án đang được chọn để quản lý nhân sự hoặc thiết kế
  const [selectedProjectForMember, setSelectedProjectForMember] = useState(() => {
    const saved = localStorage.getItem('wisdom_dt_member_proj');
    return saved ? JSON.parse(saved) : null;
  });

  // Hiệu ứng lưu trạng thái vào localStorage để khi F5 không bị mất trang
  useEffect(() => {
    localStorage.setItem('wisdom_dt_view', currentView);
    if (selectedProjectForMember) {
      localStorage.setItem('wisdom_dt_member_proj', JSON.stringify(selectedProjectForMember));
    }
  }, [currentView, selectedProjectForMember]);

  // 2. Logic đồng bộ dữ liệu: Tự động tải Element từ Backend khi vào Editor
  // SỬA LỖI: Chỉ gọi fetch khi Project ID thay đổi hoặc view chuyển sang editor để tránh vòng lặp vô hạn
  useEffect(() => {
    if (currentView === 'editor' && currentProject?.id) {
      fetchElements(currentProject.id);
    }
  }, [currentView, currentProject?.id]); 

  // Nếu chưa đăng nhập, hiển thị trang Auth (Login/Register)
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  /**
   * ĐIỀU HƯỚNG: Chuyển đến trình thiết kế 3D (Editor)
   */
  const handleGoToEditor = (project) => {
    console.log("Mở trình thiết kế cho dự án:", project.name);
    selectProject(project);
    setCurrentView('editor');
  };

  /**
   * ĐIỀU HƯỚNG: Chuyển đến trang quản lý nhân sự (Members)
   */
  const handleGoToMembers = (project) => {
    console.log("Mở quản lý nhân sự cho dự án:", project.name);
    setSelectedProjectForMember(project);
    setCurrentView('members');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100vw', 
      height: '100vh', 
      background: '#0f172a', 
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden' 
    }}>
      
      {/* --- THANH ĐIỀU HƯỚNG (HEADER) - CỐ ĐỊNH 70PX --- */}
      <header style={{ 
        height: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 30px', 
        zIndex: 1001, 
        background: (currentView === 'editor' || currentView === 'members') ? 'rgba(15, 23, 42, 0.8)' : 'transparent', 
        backdropFilter: (currentView === 'editor' || currentView === 'members') ? 'blur(10px)' : 'none', 
        borderBottom: (currentView === 'editor' || currentView === 'members') ? '1px solid rgba(255,255,255,0.05)' : 'none',
        flexShrink: 0
      }}>
        {/* Bên trái: Logo thương hiệu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentView('projects')}>
          <div style={{ 
            width: '36px', height: '36px', background: '#3b82f6', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <Box size={20} />
          </div>
          <div style={{ fontWeight: '800', fontSize: '18px', color: '#fff', letterSpacing: '0.5px' }}>
            WISDOM <span style={{ color: '#3b82f6' }}>DT</span>
          </div>
        </div>

        {/* Giữa: Thông tin ngữ cảnh (Breadcrumb hiển thị tên Project) */}
        {(currentView === 'editor' || currentView === 'members') && (
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            color: '#94a3b8', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            {currentView === 'members' ? 'Quản lý nhân sự: ' : 'Thiết kế 3D: '}
            <span style={{ color: '#fff', fontWeight: '700' }}>
                {currentView === 'editor' ? currentProject?.name : selectedProjectForMember?.name}
            </span>
          </div>
        )}

        {/* Bên phải: Menu điều hướng đối xứng */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(30, 41, 59, 0.6)', 
          padding: '6px', 
          borderRadius: '14px', 
          border: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <button 
            onClick={() => setCurrentView('projects')} 
            title="Dự án" 
            style={{ 
              width: '36px', height: '36px', 
              background: currentView === 'projects' ? '#3b82f6' : 'transparent', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: 'white', border: 'none', cursor: 'pointer', transition: '0.2s' 
            }}
          >
            <Briefcase size={18} />
          </button>
          
          <button 
            onClick={() => setCurrentView('profile')} 
            title="Hồ sơ cá nhân" 
            style={{ 
              width: '36px', height: '36px', 
              background: currentView === 'profile' ? '#3b82f6' : 'transparent', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: 'white', border: 'none', cursor: 'pointer', transition: '0.2s' 
            }}
          >
            <UserIcon size={18} />
          </button>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

          <button 
            onClick={logout} 
            style={{ 
              background: 'transparent', border: 'none', color: '#f87171', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px',
              borderRadius: '10px'
            }}
            title="Đăng xuất"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- VÙNG NỘI DUNG CHÍNH (CHIẾM TOÀN BỘ PHẦN CÒN LẠI) --- */}
      <main style={{ 
        flex: 1, 
        width: '100%', 
        position: 'relative',
        display: 'flex',
        overflow: 'hidden'
      }}>
        
        {/* TRANG 1: DASHBOARD DỰ ÁN */}
        {currentView === 'projects' && (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
             <ProjectDashboard 
                onEnterProject={handleGoToEditor} 
                onManageMembers={handleGoToMembers} 
             />
          </div>
        )}

        {/* TRANG 2: QUẢN LÝ THÀNH VIÊN (Project Member Service) */}
        {currentView === 'members' && (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <ProjectMemberPage 
              project={selectedProjectForMember} 
              onBack={() => setCurrentView('projects')} 
              onEnterEditor={handleGoToEditor}
            />
          </div>
        )}
        
        {/* TRANG 3: HỒ SƠ CÁ NHÂN (Auth Service Profile) */}
        {currentView === 'profile' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProfilePage onBack={() => setCurrentView('projects')} />
          </div>
        )}
        
        {/* TRANG 4: TRÌNH THIẾT KẾ 3D (Element & Element Detail Service) */}
        {currentView === 'editor' && (
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            height: '100%',
            background: '#020617'
          }}>
            {/* SỬA LỖI: Canvas chiếm full không gian còn lại */}
            <div style={{ flex: 1, position: 'relative', height: '100%' }}>
              <MainCanvas />
            </div>
            
            {/* Sidebar thuộc tính bên phải (320px) */}
            <ConstructionPanel />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;