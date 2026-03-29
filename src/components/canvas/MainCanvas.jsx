import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, ContactShadows, Environment } from '@react-three/drei';
import useConstructionStore from '../../store/useConstructionStore';
import GenericElement from '../elements/GenericElement';

const MainCanvas = () => {
  const { 
    elements, 
    selectedElementId, 
    transformMode, 
    setTransformMode,
    removeElement,
    duplicateElement, // Lấy hàm nhân bản
    updateElementPosition, 
    updateElementRotation, 
    deselectElement 
  } = useConstructionStore();
  
  const orbitRef = useRef();

  // Hệ thống phím tắt nâng cao
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      
      if (key === 'g') setTransformMode('translate');
      if (key === 'r') setTransformMode('rotate');
      
      // Nhấn 'D' để nhân bản khối đang chọn - Task 6
      if (key === 'd' && selectedElementId) {
        duplicateElement(selectedElementId);
      }
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
        removeElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, setTransformMode, removeElement, duplicateElement]);

  // Hàm tính toán Snap to Grid - Task 5
  const snapValue = (val, step = 0.5) => {
    return Math.round(val / step) * step;
  };

  return (
    <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }} onPointerMissed={() => deselectElement()}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Environment preset="city" />
      
      <OrbitControls ref={orbitRef} makeDefault />
      <Grid infiniteGrid fadeDistance={50} cellColor="#444" sectionColor="#666" />

      {elements.map((el) => {
        const isSelected = selectedElementId === el.id;

        if (isSelected) {
          return (
            <TransformControls 
              key={el.id} 
              mode={transformMode}
              showY={true} 
              onMouseDown={() => (orbitRef.current.enabled = false)}
              onMouseUp={(e) => {
                orbitRef.current.enabled = true;
                if (transformMode === 'translate') {
                  const { x, y, z } = e.target.object.position;
                  const height = el.args[1];
                  
                  // Áp dụng Snap to Grid (Task 5) và Chống sụp sàn (Task 4)
                  const snappedX = snapValue(x);
                  const snappedZ = snapValue(z);
                  const groundLevel = height / 2;
                  const correctedY = Math.max(y, groundLevel);
                  // Có thể snap cả Y nếu muốn xếp tầng khít
                  const snappedY = snapValue(correctedY); 

                  updateElementPosition(el.id, [snappedX, snappedY, snappedZ]);
                } else {
                  // Snap góc xoay (ví dụ snap mỗi 15 độ = PI/12)
                  const { x, y, z } = e.target.object.rotation;
                  const angleStep = Math.PI / 12; 
                  updateElementRotation(el.id, [
                    snapValue(x, angleStep),
                    snapValue(y, angleStep),
                    snapValue(z, angleStep)
                  ]);
                }
              }}
            >
              <GenericElement {...el} />
            </TransformControls>
          );
        }

        return <GenericElement key={el.id} {...el} />;
      })}

      <GenericElement id="ground-floor" geometry="BOX" position={[0, -0.25, 0]} args={[15, 0.5, 15]} color="#94a3b8" />
      <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />
    </Canvas>
  );
};

export default MainCanvas;