import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls, ContactShadows, Environment } from '@react-three/drei';
import useConstructionStore from '../../store/useConstructionStore.js';
import GenericElement from '../elements/GenericElement.jsx';

/**
 * MainCanvas - Viewport 3D chính
 */
const MainCanvas = () => {
  const { elements, selectedElementId, transformMode, updateTransform, selectElement } = useConstructionStore();
  const orbitRef = useRef();

  const handleTransformEnd = (e) => {
    if (!selectedElementId) return;
    const obj = e.target.object;
    updateTransform(
      selectedElementId, 
      [obj.position.x, obj.position.y, obj.position.z],
      [obj.rotation.x, obj.rotation.y, obj.rotation.z]
    );
    orbitRef.current.enabled = true;
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#020617' }}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }} onPointerMissed={() => selectElement(null)}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[15, 15, 15]} intensity={1} castShadow />
          <Environment preset="city" />
          
          <OrbitControls ref={orbitRef} makeDefault />

          {/* Grid và Mặt phẳng cơ sở */}
          <Grid infiniteGrid fadeDistance={50} cellColor="#1e293b" sectionColor="#334155" sectionSize={5} cellSize={1} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.4} />
          </mesh>

          {elements.map((el) => {
            const isSelected = selectedElementId === el.id;
            const elementMesh = <GenericElement key={el.id} element={el} isSelected={isSelected} />;

            if (isSelected) {
              return (
                <TransformControls 
                  key={`t-${el.id}`} 
                  mode={transformMode}
                  onMouseDown={() => (orbitRef.current.enabled = false)}
                  onMouseUp={handleTransformEnd}
                >
                  {elementMesh}
                </TransformControls>
              );
            }
            return elementMesh;
          })}

          <ContactShadows opacity={0.6} scale={40} blur={2} far={10} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MainCanvas;