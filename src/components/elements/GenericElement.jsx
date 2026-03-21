import { useState } from 'react';
import useConstructionStore from '../../store/useConstructionStore';

const GenericElement = ({ id, geometry, position, rotation, args, color = "#4ade80", name }) => {
  const [hovered, setHover] = useState(false);
  const selectElement = useConstructionStore((state) => state.selectElement);
  const isSelected = useConstructionStore((state) => state.selectedElementId === id);

  const getGeometry = () => {
    switch (geometry) {
      case 'CYLINDER':
        return <cylinderGeometry args={args} />;
      case 'CONE':
        return <coneGeometry args={args} />;
      case 'BOX':
      default:
        return <boxGeometry args={args} />;
    }
  };

  return (
    <mesh 
      position={position}
      rotation={rotation} // [ĐÃ ĐỒNG BỘ] Nhận giá trị từ Store truyền xuống
      onClick={(e) => {
        e.stopPropagation();
        selectElement(id);
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={isSelected ? "#f472b6" : color} 
        metalness={isSelected ? 0.7 : 0.5} 
        roughness={0.2} 
      />
    </mesh>
  );
};

export default GenericElement;