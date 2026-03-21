// src/App.jsx
import MainCanvas from './components/canvas/MainCanvas';
import ConstructionPanel from './components/ui/ConstructionPanel';
import './App.css'; // Giữ import CSS để đảm bảo background-color tối

function App() {
  // Chúng ta sẽ dùng layout CSS inline để kết hợp 3D và Panel 2D
  const dashboardStyles = {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    position: 'relative', // Để Panel có thể absolute bên phải
    overflow: 'hidden'
  };

  const canvasWrapperStyles = {
    flex: 1, // Canvas chiếm hết không gian còn lại bên trái
    height: '100%',
    position: 'relative'
  };

  return (
    <div style={dashboardStyles} id="digital-twin-dashboard">
      {/* 1. Khu vực Canvas 3D (Bên Trái) */}
      <div style={canvasWrapperStyles}>
        <MainCanvas />
      </div>

      {/* 2. Bảng điều khiển UI (Bên Phải) */}
      <ConstructionPanel />
    </div>
  );
};

export default App;