import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

/**
 * Giao diện Login và Register được thiết kế đồng bộ với hệ thống Digital Twin.
 * Sử dụng các trường dữ liệu từ DTO: fullName, email, password.
 */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const { login, register, loading, error } = useAuthStore();

  const handleAction = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      const result = await register(formData.fullName, formData.email, formData.password);
      if (result.success) {
        // Sau khi đăng ký thành công, chuyển về trang login
        setIsLogin(true);
      }
    }
  };

  // --- Styles ---
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    background: '#0f172a',
    fontFamily: "'Inter', sans-serif",
    overflow: 'hidden'
  };

  const formSectionStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#f8fafc'
  };

  const visualSectionStyle = {
    flex: '1.2',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderLeft: '1px solid rgba(255,255,255,0.1)'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 48px',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const btnStyle = {
    width: '100%',
    padding: '14px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
    transition: 'background 0.2s'
  };

  return (
    <div style={containerStyle}>
      {/* Cột trái: Form */}
      <div style={formSectionStyle}>
        <div style={cardStyle}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '16px' }}>
              <ShieldCheck size={32} />
              <span style={{ fontWeight: '900', letterSpacing: '1px' }}>WISDOM DT</span>
            </div>
            <h1 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: '800' }}>
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              {isLogin ? 'Chào mừng bạn quay lại hệ thống Digital Twin.' : 'Bắt đầu hành trình kiến tạo mô hình số của bạn.'}
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', fontSize: '14px' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleAction}>
            {!isLogin && (
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', top: '13px', color: '#64748b' }} />
                <input 
                  style={inputStyle} 
                  placeholder="Họ và tên của bạn" 
                  required
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '13px', color: '#64748b' }} />
              <input 
                style={inputStyle} 
                type="email" 
                placeholder="Email tài khoản" 
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '13px', color: '#64748b' }} />
              <input 
                style={inputStyle} 
                type="password" 
                placeholder="Mật khẩu bảo mật" 
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button style={{...btnStyle, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Vui lòng chờ...' : (isLogin ? 'Vào hệ thống' : 'Tạo tài khoản')}
              <ArrowRight size={20} />
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
            {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản sẵn?'} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', marginLeft: '8px' }}
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </div>
        </div>
      </div>

      {/* Cột phải: Hình ảnh trang trí (Chỉ hiển thị trên desktop) */}
      <div style={visualSectionStyle}>
         <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: '120px', marginBottom: '20px', opacity: 0.8 }}>🏗️</div>
         </div>
         {/* Hiệu ứng mờ nền */}
         <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: '#3b82f6', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }}></div>
      </div>
    </div>
  );
};

export default AuthPage;