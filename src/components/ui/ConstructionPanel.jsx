import React from 'react';
import { Layers, Settings, Maximize2, RotateCcw, Box, Zap } from 'lucide-react';
import useConstructionStore from '../../store/useConstructionStore';
import useProjectStore from '../../store/useProjectStore';
// SỬA ĐƯỜNG DẪN: Theo ảnh image_efa89e.png, thư mục là "elements Detail"
import ElementDetailPage from '../elements Detail/ElementDetailPage';

/**
 * ConstructionPanel - Sidebar chính quản lý Element (Thực thể) & Detail (Chi tiết mặt).
 * Đã sửa lỗi đường dẫn import và tích hợp hiển thị ElementDetailPage.
 */
const ConstructionPanel = () => {
  const { currentProject } = useProjectStore();
  const { elements, selectedElementId, transformMode, setTransformMode, addElement } = useConstructionStore();

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <aside style={{ width: '320px', height: '100%', background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* 1. KHU VỰC THƯ VIỆN VẬT THỂ (Element Service) */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ color: '#64748b', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' }}>Thư viện vật thể</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {['BOX', 'CYLINDER', 'CONE'].map(type => (
            <button 
              key={type} 
              onClick={() => addElement(currentProject?.id, type)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
            >
              + {type}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KHU VỰC THUỘC TÍNH CHI TIẾT */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <h3 style={{ color: '#64748b', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' }}>Thuộc tính chi tiết</h3>
        
        {selectedElement ? (
          <div>
            {/* Thông tin định danh */}
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold' }}>ELEMENT ID</span>
              <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{selectedElement.id}</div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{selectedElement.name}</div>
            </div>

            {/* Điều khiển Transform (Element Service) */}
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>CHẾ ĐỘ THAO TÁC</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
              <button onClick={() => setTransformMode('translate')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: transformMode === 'translate' ? '#3b82f6' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' }}><Maximize2 size={18} /></button>
              <button onClick={() => setTransformMode('rotate')} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: transformMode === 'rotate' ? '#3b82f6' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' }}><RotateCcw size={18} /></button>
            </div>

            {/* QUẢN LÝ ELEMENT DETAIL (Microservice Element Detail) */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
               <ElementDetailPage elementId={selectedElement.id} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#475569', marginTop: '60px' }}>
             <Zap size={40} style={{ opacity: 0.1, margin: '0 auto 16px' }} />
             <p style={{ fontSize: '13px' }}>Chọn một khối 3D trên màn hình để cấu hình.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ConstructionPanel;