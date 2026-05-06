import React, { useState } from 'react';
import { Plus, Box, Palette, X, Save, Layers } from 'lucide-react';
import useConstructionStore from '../../store/useConstructionStore';

/**
 * ElementDetailPage - Giao diện quản lý danh sách vật liệu từng mặt.
 * Kết nối với Microservice Element Detail qua store.
 */
const ElementDetailPage = ({ elementId }) => {
  const { currentDetails, createElementDetail, loading } = useConstructionStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ faceName: 'MAIN', materialId: 'STEEL_ID', scale: 1 });

  const handleAdd = async (e) => {
    e.preventDefault();
    await createElementDetail(elementId, formData);
    setIsAdding(false);
    setFormData({ faceName: 'MAIN', materialId: 'STEEL_ID', scale: 1 });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Cấu hình chi tiết mặt</h4>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', padding: '4px', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Form thêm chi tiết mới (CreateElementDetailDto) */}
      {isAdding && (
        <form onSubmit={handleAdd} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>TÊN MẶT (FACE NAME)</label>
            <input 
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '12px', outline: 'none' }}
              value={formData.faceName}
              onChange={e => setFormData({...formData, faceName: e.target.value})}
              placeholder="VD: FRONT, TOP, MAIN..."
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>VẬT LIỆU (MATERIAL)</label>
            <select 
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
              value={formData.materialId}
              onChange={e => setFormData({...formData, materialId: e.target.value})}
            >
              <option value="STEEL_ID">Thép công nghiệp</option>
              <option value="CONCRETE_ID">Bê tông</option>
              <option value="WOOD_ID">Gỗ tự nhiên</option>
              <option value="PLASTIC_ID">Nhựa tổng hợp</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
            {loading ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
          </button>
        </form>
      )}

      {/* Danh sách các Detail hiện có (ElementDetailRestItem) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {currentDetails.map((detail) => (
          <div key={detail.id} style={{ background: '#1e293b', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '800', fontSize: '12px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> {detail.faceName}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>SCALE: {detail.scale}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={12} /> {detail.materialId}
            </div>
          </div>
        ))}
        
        {currentDetails.length === 0 && !isAdding && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#475569', fontSize: '12px', fontStyle: 'italic' }}>
            Chưa có cấu hình mặt nào cho vật thể này.
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementDetailPage;