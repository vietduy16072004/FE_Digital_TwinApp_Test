import useConstructionStore, { SHAPE_DEFINITIONS, MATERIAL_DEFINITIONS } from '../../store/useConstructionStore';

/**
 * ConstructionPanel - Giao diện điều khiển chính của ứng dụng Digital Twin.
 * Bao gồm: Chế độ thao tác, Thư viện vật liệu PBR, và Thư viện cấu kiện 3D.
 */
const ConstructionPanel = () => {
  const { 
    addElement, 
    resetScene, 
    transformMode, 
    setTransformMode, 
    currentMaterialId, 
    setCurrentMaterial, 
    selectedElementId, 
    updateElementMaterial 
  } = useConstructionStore();

  // --- HỆ THỐNG STYLES ---

  const panelStyles = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '280px',
    height: 'calc(100vh - 40px)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    zIndex: 1000,
    padding: '24px 8px 24px 20px', // Thu hẹp padding phải để thanh cuộn sát lề
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    overflow: 'hidden'
  };

  const headerStyles = {
    marginBottom: '20px',
    paddingRight: '12px'
  };

  const scrollAreaStyles = {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const sectionTitleStyles = {
    fontSize: '11px',
    fontWeight: '800',
    color: '#a4b0be',
    letterSpacing: '1.2px',
    marginBottom: '12px',
    textTransform: 'uppercase'
  };

  const modeGroupStyles = {
    display: 'flex',
    gap: '6px',
    background: '#f1f2f6',
    padding: '5px',
    borderRadius: '14px'
  };

  const getModeBtnStyle = (mode) => ({
    flex: 1,
    padding: '10px 5px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: transformMode === mode ? '#fff' : 'transparent',
    color: transformMode === mode ? '#60a5fa' : '#a4b0be',
    boxShadow: transformMode === mode ? '0 4px 10px rgba(0,0,0,0.06)' : 'none'
  });

  const getMatBtnStyle = (id) => ({
    padding: '12px 5px',
    borderRadius: '12px',
    border: currentMaterialId === id ? '2px solid #60a5fa' : '1px solid transparent',
    background: MATERIAL_DEFINITIONS[id].color,
    color: '#fff',
    fontSize: '10px',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    boxShadow: currentMaterialId === id ? `0 6px 15px -4px ${MATERIAL_DEFINITIONS[id].color}` : 'none'
  });

  const shapeBtnStyles = {
    width: '100%',
    padding: '14px',
    border: '1px solid #f1f2f6',
    borderRadius: '18px',
    background: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
  };

  const footerStyles = {
    paddingTop: '16px',
    paddingRight: '12px',
    borderTop: '2px dashed #f1f2f6',
    marginTop: '10px'
  };

  const getIcon = (type) => {
    switch(type) {
      case 'BEAM': return '▬';
      case 'COLUMN': return '●';
      case 'CONE_TRIANGLE': return '▲';
      case 'PILLAR': return '■';
      default: return '✦';
    }
  };

  return (
    <div style={panelStyles} className="digital-twin-panel">
      {/* 1. HEADER (Cố định) */}
      <div style={headerStyles}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '950', color: '#2d3436' }}>Digital Twin</h2>
        <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: '800', letterSpacing: '1.5px', marginTop: '2px' }}>
          EDITOR PANEL V0.3
        </div>
      </div>

      {/* 2. SCROLL AREA (Vùng nội dung chính) */}
      <div style={scrollAreaStyles} className="custom-scrollbar">
        
        {/* Chế độ thao tác */}
        <section>
          <div style={sectionTitleStyles}>Transform Mode</div>
          <div style={modeGroupStyles}>
            <button style={getModeBtnStyle('translate')} onClick={() => setTransformMode('translate')}>
              MOVE (G)
            </button>
            <button style={getModeBtnStyle('rotate')} onClick={() => setTransformMode('rotate')}>
              ROTATE (R)
            </button>
          </div>
        </section>

        {/* Thư viện vật liệu */}
        <section>
          <div style={sectionTitleStyles}>Material Library</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.keys(MATERIAL_DEFINITIONS).map((id) => (
              <button 
                key={id} 
                style={getMatBtnStyle(id)}
                onClick={() => {
                  setCurrentMaterial(id);
                  // Nếu đang chọn một vật thể, cập nhật vật liệu cho nó luôn
                  if (selectedElementId) updateElementMaterial(selectedElementId, id);
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {MATERIAL_DEFINITIONS[id].name}
              </button>
            ))}
          </div>
        </section>

        {/* Thư viện cấu kiện */}
        <section>
          <div style={sectionTitleStyles}>Shape Assets</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(SHAPE_DEFINITIONS).map((key) => {
              const shape = SHAPE_DEFINITIONS[key];
              return (
                <button 
                  key={key} 
                  style={shapeBtnStyles}
                  onClick={() => {
                    // Logic đặt khối lên sàn khi khởi tạo
                    const height = shape.args[1];
                    addElement(key, [0, height / 2, 0]);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#f1f2f6';
                  }}
                >
                  <div style={{ 
                    width: '38px', height: '38px', borderRadius: '10px', 
                    background: shape.color, display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', color: '#fff', fontSize: '18px', flexShrink: 0
                  }}>
                    {getIcon(key)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '900', fontSize: '13px', color: '#2d3436' }}>{shape.name}</div>
                    <div style={{ fontSize: '10px', color: '#a4b0be' }}>Nhấn để tạo</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. FOOTER (Cố định ở đáy) */}
      <div style={footerStyles}>
        <button 
          style={{ 
            width: '100%', padding: '15px', background: '#ff7675', color: '#fff', 
            border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '13px',
            cursor: 'pointer', transition: 'background 0.2s',
            boxShadow: '0 8px 20px rgba(255, 118, 117, 0.2)'
          }} 
          onClick={resetScene}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ff5252'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ff7675'}
        >
          XÓA TẤT CẢ
        </button>
      </div>
    </div>
  );
};

export default ConstructionPanel;