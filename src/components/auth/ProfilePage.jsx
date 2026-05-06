import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield, Save, ArrowLeft, CheckCircle, AlertTriangle, X, Fingerprint } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

/**
 * Path: src/components/auth/ProfilePage.jsx
 */
const ProfilePage = ({ onBack }) => {
  const { user, fetchProfile, changePassword, loading, error } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); 
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setShowForm(true), 10);
    setStatus({ type: '', message: '' });
    setPassData({ current: '', new: '', confirm: '' });
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (passData.new !== passData.confirm) {
      setStatus({ type: 'error', message: 'Mật khẩu mới không khớp!' });
      return;
    }

    const result = await changePassword(passData.current, passData.new);
    if (result.success) {
      setStatus({ type: 'success', message: 'Cập nhật mật khẩu thành công!' });
      setTimeout(handleCloseModal, 2000);
    }
  };

  // --- HỆ THỐNG STYLES TỐI ƯU ---
  const containerStyle = {
    minHeight: '100vh',
    background: '#0f172a',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    color: '#f8fafc'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(30, 41, 59, 0.45)',
    borderRadius: '32px',
    padding: '48px 40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    textAlign: 'center'
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    display: 'block'
  };

  const valueStyle = {
    fontSize: '19px',
    color: '#ffffff',
    fontWeight: '600'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(2, 6, 23, 0.6)',
    backdropFilter: 'blur(12px)',
    display: isModalOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    opacity: showForm ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const modalContentStyle = {
    width: '90%',
    maxWidth: '420px',
    background: '#1e293b',
    padding: '40px',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
    transform: showForm ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    textAlign: 'left'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        

        <div style={cardStyle}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '24px', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)', transform: 'rotate(-2deg)' }}>
            <User size={40} color="white" />
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '6px 20px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', display: 'inline-block', marginBottom: '32px' }}>HỒ SƠ CỦA BẠN</div>
          
          <div style={{ marginBottom: '28px' }}>
            <span style={labelStyle}>Địa chỉ Email</span>
            <div style={valueStyle}>{user?.email}</div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <span style={labelStyle}>Mã định danh (UID)</span>
            <div style={{ ...valueStyle, fontSize: '14px', color: '#64748b', fontFamily: 'monospace' }}>{user?.id}</div>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <span style={labelStyle}>Vai trò</span>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
              {user?.roles?.map(role => (
                <div key={role} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} /> {role}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleOpenModal}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', border: 'none', borderRadius: '16px', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)' }}
          >
            <Lock size={18} /> ĐỔI MẬT KHẨU
          </button>
        </div>
      </div>

      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <button onClick={handleCloseModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Fingerprint size={28} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>Cập nhật mật khẩu</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Vui lòng nhập mật khẩu cũ và mật khẩu mới.</p>

          {(status.message || error) && (
            <div style={{ padding: '16px', borderRadius: '14px', fontSize: '14px', marginBottom: '24px', background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#4ade80' : '#f87171', display: 'flex', gap: '10px', alignItems: 'center' }}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              {status.message || error}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Mật khẩu hiện tại</label>
              <input type="password" style={{ width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} required value={passData.current} onChange={(e) => setPassData({...passData, current: e.target.value})} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Mật khẩu mới</label>
              <input type="password" style={{ width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} required value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Xác nhận mật khẩu mới</label>
              <input type="password" style={{ width: '100%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} required value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#3b82f6', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Save size={18} /> {loading ? 'ĐANG LƯU...' : 'XÁC NHẬN THAY ĐỔI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;