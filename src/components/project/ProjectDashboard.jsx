import React, { useState, useEffect } from 'react';
import { 
  Plus, Folder, Users, ExternalLink, Calendar, 
  Trash2, Search, AlertCircle, X, ChevronRight,
  Type, AlignLeft, Sparkles, Loader2
} from 'lucide-react';
import useProjectStore from '../../store/useProjectStore.js';

/**
 * ProjectDashboard - Giao diện quản lý dự án.
 * Tách biệt rõ ràng nút "Mở dự án" và nút "Quản lý thành viên".
 */
const ProjectDashboard = ({ onEnterProject, onManageMembers }) => {
  const { projects, fetchProjects, createProject, deleteProject, loading } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(null);
  const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createProject(newProjectData.name, newProjectData.description);
    if (res.success) {
      setIsCreateModalOpen(false);
      setNewProjectData({ name: '', description: '' });
    }
  };

  const handleDelete = async () => {
    if (isDeleteConfirmOpen) {
      await deleteProject(isDeleteConfirmOpen);
      setIsDeleteConfirmOpen(null);
    }
  };

  return (
    <div style={{ padding: '80px 40px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .card-hover:hover { transform: translateY(-6px); border-color: #3b82f6 !important; }
        .btn-icon:hover { background: rgba(59, 130, 246, 0.2) !important; color: #fff !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Dự án mô phỏng</h1>
            <p style={{ color: '#64748b', marginTop: '6px' }}>Kiến tạo các bản sao số Digital Twin hiện đại</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} strokeWidth={3} /> TẠO DỰ ÁN MỚI
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="card-hover"
              style={{ background: 'rgba(30, 41, 59, 0.45)', borderRadius: '32px', padding: '36px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', position: 'relative', transition: '0.3s ease' }}
            >
               {/* Nhóm nút icon góc trên */}
               <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => onManageMembers(project)}
                  className="btn-icon"
                  style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '10px', borderRadius: '12px', color: '#60a5fa', cursor: 'pointer', transition: '0.2s' }}
                  title="Quản lý thành viên"
                >
                  <Users size={18} />
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(project.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '10px', borderRadius: '12px', color: '#f87171', cursor: 'pointer' }}
                  title="Xóa dự án"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '24px' }}>
                <Folder size={30} />
              </div>
              
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>{project.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px', minHeight: '45px' }}>{project.description || 'Chưa có thông tin mô tả cho dự án này.'}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '12px', fontWeight: '700' }}>
                  <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                </div>
                <button 
                  onClick={() => onEnterProject(project)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  MỞ DỰ ÁN <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Khởi tạo */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '32px', width: '440px', border: '1px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
               <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>Khởi tạo dự án</h2>
               <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Tên dự án</label>
                <input style={{ width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', marginTop: '8px', boxSizing: 'border-box' }} required value={newProjectData.name} onChange={e => setNewProjectData({...newProjectData, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Mô tả ngắn</label>
                <textarea style={{ width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', marginTop: '8px', boxSizing: 'border-box', height: '100px', resize: 'none' }} value={newProjectData.description} onChange={e => setNewProjectData({...newProjectData, description: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>
                {loading ? 'ĐANG XỬ LÝ...' : 'BẮT ĐẦU KIẾN TẠO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;