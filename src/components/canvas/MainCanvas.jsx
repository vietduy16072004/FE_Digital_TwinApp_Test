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
    updateElementPosition, 
    updateElementRotation, 
    deselectElement 
  } = useConstructionStore();
  
  const orbitRef = useRef();

  // [BỔ SUNG] Cài đặt phím tắt bàn phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Nhấn 'G' hoặc 'g' để di chuyển
      if (event.key.toLowerCase() === 'g') {
        setTransformMode('translate');
      }
      // Nhấn 'R' hoặc 'r' để xoay
      if (event.key.toLowerCase() === 'r') {
        setTransformMode('rotate');
      }
      // Nhấn 'Delete' hoặc 'Backspace' để xóa khối đang chọn
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
        removeElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, setTransformMode, removeElement]);

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
              showY={transformMode === 'translate' ? false : true} 
              onMouseDown={() => (orbitRef.current.enabled = false)}
              onMouseUp={(e) => {
                orbitRef.current.enabled = true;
                if (transformMode === 'translate') {
                  const { x, z } = e.target.object.position;
                  const height = el.args[1];
                  updateElementPosition(el.id, [x, height / 2, z]);
                } else {
                  const { x, y, z } = e.target.object.rotation;
                  updateElementRotation(el.id, [x, y, z]);
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