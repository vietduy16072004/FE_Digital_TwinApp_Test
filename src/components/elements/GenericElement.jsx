import React from 'react';
import useConstructionStore from '../../store/useConstructionStore.js';

/**
 * GenericElement - Mesh hiển thị vật thể 3D
 */
const GenericElement = ({ element, isSelected }) => {
  const selectElement = useConstructionStore(state => state.selectElement);

  const getGeometry = () => {
    switch (element.type) {
      case 'CYLINDER': return <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />;
      case 'CONE': return <coneGeometry args={[0.5, 1.5, 32]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh 
      position={[element.transform.position.x, element.transform.position.y, element.transform.position.z]}
      rotation={[element.transform.rotation.x, element.transform.rotation.y, element.transform.rotation.z]}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={isSelected ? "#3b82f6" : "#94a3b8"} 
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
};

export default GenericElement;