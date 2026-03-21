import useConstructionStore, { SHAPE_DEFINITIONS } from '../../store/useConstructionStore';

const ConstructionPanel = () => {
  const addElement = useConstructionStore((state) => state.addElement);
  const resetScene = useConstructionStore((state) => state.resetScene);
  
  // Lấy trạng thái và hàm điều khiển chế độ thao tác (Translate/Rotate)
  const transformMode = useConstructionStore((state) => state.transformMode);
  const setTransformMode = useConstructionStore((state) => state.setTransformMode);

  // --- CẤU HÌNH GIAO DIỆN (STYLES) ---

  const panelStyles = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '260px',
    height: 'calc(100vh - 40px)',
    background: 'rgba(255, 255, 255, 0.95)', // Nền trắng trong suốt
    backdropFilter: 'blur(15px)', // Hiệu ứng làm mờ nền 3D phía sau
    borderRadius: '20px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    zIndex: 1000,
    padding: '24px 16px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  };

  const modeButtonGroupStyles = {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
    padding: '4px',
    background: '#f1f2f6',
    borderRadius: '12px'
  };

  const getModeBtnStyle = (mode) => ({
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: transformMode === mode ? '#fff' : 'transparent',
    color: transformMode === mode ? '#60a5fa' : '#a4b0be',
    boxShadow: transformMode === mode ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
  });

  const scrollContainerStyles = {
    flex: 1,
    overflowY: 'auto', // Cuộn dọc danh sách
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '6px'
  };

  // Style cho từng nút bấm thêm khối
  const buttonStyles = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '14px',
    background: '#ffffff', // Nút bấm màu trắng
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  const handleAdd = (type) => {
    // Thêm khối mới ở vị trí trung tâm, offset độ cao bằng một nửaargs[1]
    const height = SHAPE_DEFINITIONS[type].args[1];
    addElement(type, [0, height / 2, 0]);
  };

  return (
    <div style={panelStyles} id="digital-twin-panel">
      {/* Tiêu đề Panel */}
      <div style={{ textAlign: 'left', paddingLeft: '8px', marginBottom: '5px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#2d3436' }}>Digital Twin</h2>
        <div style={{ fontSize: '11px', color: '#636e72', fontWeight: '500' }}>CONTROL PANEL V0.3</div>
      </div>

      {/* Nhóm nút chuyển đổi chế độ: Di chuyển / Xoay */}
      <div style={modeButtonGroupStyles}>
        <button style={getModeBtnStyle('translate')} onClick={() => setTransformMode('translate')}>
          DI CHUYỂN
        </button>
        <button style={getModeBtnStyle('rotate')} onClick={() => setTransformMode('rotate')}>
          XOAY CHIỀU
        </button>
      </div>

      {/* DANH SÁCH CẤU KIỆN (ĐÃ SỬA LỖI HÌNH ẢNH/TÊN) */}
      <div style={scrollContainerStyles} className="custom-scrollbar">
        {Object.keys(SHAPE_DEFINITIONS).map((key) => {
          const shape = SHAPE_DEFINITIONS[key];
          
          // [ĐÃ KHÔI PHỤC] Chọn biểu tượng văn bản đại diện cho hình dáng
          const getIcon = (type) => {
            switch(type) {
              case 'BEAM': return '▬';
              case 'COLUMN': return '●';
              case 'CONE_TRIANGLE': return '▲';
              case 'PILLAR': return '■';
              default: return '✧';
            }
          }

          return (
            <button 
              key={key} 
              style={buttonStyles} 
              onClick={() => handleAdd(key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = shape.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
              }}
            >
              {/* [ĐÃ KHÔI PHỤC] Icon màu sắc bo góc chứa biểu tượng hình dáng */}
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: shape.color, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff', // Màu biểu tượng trắng
                fontSize: '18px',
                flexShrink: 0 
              }}>
                {getIcon(key)} {/* Biểu tượng hình dáng */}
              </div>

              {/* [ĐÃ KHÔI PHỤC] Tên khối và chú thích */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#2d3436' }}>
                  {shape.name} {/* Tên khối: Pillar, Column, ... */}
                </div>
                <div style={{ fontSize: '11px', color: '#b2bec3', marginTop: '2px' }}>
                  Click để tạo
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Nút Xóa tất cả nằm ở dưới cùng */}
      <div style={{ paddingTop: '10px', borderTop: '2px dashed #eee' }}>
        <button 
          style={{ 
            ...buttonStyles, 
            background: '#ff7675', // Màu đỏ rose
            color: '#fff', 
            border: 'none', 
            justifyContent: 'center', 
            fontWeight: '800',
            fontSize: '14px'
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