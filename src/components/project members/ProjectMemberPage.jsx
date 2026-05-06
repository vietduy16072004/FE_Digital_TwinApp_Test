import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, UserMinus, Shield, ShieldCheck, 
  ShieldAlert, ArrowLeft, Search, Loader2, X, CheckCircle, ExternalLink, AlertCircle 
} from 'lucide-react';
import useProjectMemberStore from '../../store/useProjectMemberStore';

/**
 * ProjectMemberPage - Giao diện quản lý nhân sự dự án.
 * Đã tối ưu hóa cực độ để chống crash màn hình đen bằng cách kiểm tra dữ liệu đầu vào.
 */
const ProjectMemberPage = ({ project, onBack, onEnterEditor }) => {
  const { members, fetchMembers, addMember, updateMemberRole, removeMember, loading, error } = useProjectMemberStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ userId: '', role: 'VIEWER' });
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  // Tải danh sách thành viên khi có ID dự án
  useEffect(() => {
    if (project?.id) {
      fetchMembers(project.id).catch(err => {
        console.error("Lỗi khi tải thành viên:", err);
      });
    }
  }, [project?.id]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    
    const res = await addMember(project.id, newMember.userId, newMember.role);
    if (res.success) {
      showToast('Đã thêm thành viên thành công!');
      setIsAddModalOpen(false);
      setNewMember({ userId: '', role: 'VIEWER' });
    } else {
      showToast(res.error || 'Lỗi khi thêm thành viên', 'error');
    }
  };

  /**
   * PHẦN QUAN TRỌNG: Lọc dữ liệu an toàn.
   * Đảm bảo members luôn là mảng và từng phần tử có userId hợp lệ trước khi xử lý chuỗi.
   */
  const safeMembers = Array.isArray(members) ? members : [];
  
  const filteredMembers = safeMembers.filter(m => {
    if (!m || typeof m.userId !== 'string') return false;
    return m.userId.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  // Nếu không có thông tin project (do truyền từ App.jsx bị lỗi), hiển thị lỗi nhẹ nhàng thay vì đen màn hình
  if (!project) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: '#f8fafc' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2>Không tìm thấy dự án</h2>
        <p style={{ color: '#64748b' }}>Dữ liệu dự án không được truyền chính xác vào trang quản lý.</p>
        <button onClick={onBack} style={{ marginTop: '20px', background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Thông báo Toast */}
      {toast.show && (
        <div style={{ 
          position: 'fixed', top: '20px', right: '20px', 
          background: toast.type === 'success' ? '#10b981' : '#ef4444', 
          padding: '12px 24px', borderRadius: '12px', zIndex: 4000, 
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontWeight: '700' }}>{toast.msg}</span>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
            <ArrowLeft size={16} /> QUAY LẠI DASHBOARD
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Quản lý nhân sự</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Dự án: <span style={{ color: '#3b82f6', fontWeight: '800' }}>{project.name}</span></p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onEnterEditor && onEnterEditor(project)}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <ExternalLink size={18} /> VÀO EDITOR
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 15px rgba(59, 130, 246, 0.3)' }}
            >
                <UserPlus size={18} /> THÊM THÀNH VIÊN
            </button>
        </div>
      </header>

      {/* Vùng hiển thị lỗi từ Store nếu có */}
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: '#475569' }} />
                <input 
                  style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                  placeholder="Tìm thành viên theo ID..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>
        </div>

        <div style={{ minHeight: '400px' }}>
          {loading && safeMembers.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <Loader2 size={40} className="animate-spin" color="#3b82f6" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#64748b' }}>
              <Users size={48} style={{ marginBottom: '12px', opacity: 0.2 }} />
              <p>Chưa có thành viên nào hoặc không tìm thấy kết quả.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '16px 24px' }}>Thành viên</th>
                  <th style={{ padding: '16px 24px' }}>Vai trò</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <tr key={member.userId || `member-${index}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '800' }}>ID</div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{member.userId}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid currentColor' }}>{member.projectRole}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <select 
                          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px', padding: '6px', outline: 'none', cursor: 'pointer' }} 
                          value={member.projectRole} 
                          onChange={(e) => updateMemberRole(project.id, member.userId, e.target.value)}
                        >
                          <option value="VIEWER">VIEWER</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button 
                          onClick={() => removeMember(project.id, member.userId)} 
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '8px', borderRadius: '10px', color: '#f87171', cursor: 'pointer' }}
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal thêm thành viên */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '28px', width: '400px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
               <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Thêm thành viên</h2>
               <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>User ID (UUID)</label>
                <input style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', boxSizing: 'border-box', outline: 'none' }} required placeholder="Nhập mã UUID..." value={newMember.userId} onChange={(e) => setNewMember({...newMember, userId: e.target.value})} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Vai trò</label>
                <select style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', boxSizing: 'border-box', cursor: 'pointer', outline: 'none' }} value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})}>
                  <option value="VIEWER">VIEWER</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#3b82f6', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '800', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'ĐANG XỬ LÝ...' : 'THÊM NGAY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMemberPage;