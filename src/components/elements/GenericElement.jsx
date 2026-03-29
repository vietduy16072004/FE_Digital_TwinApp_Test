import useConstructionStore, { MATERIAL_DEFINITIONS } from '../../store/useConstructionStore';

const GenericElement = ({ id, geometry, position, rotation, args, materialId, color: defaultColor }) => {
  const selectElement = useConstructionStore((state) => state.selectElement);
  const isSelected = useConstructionStore((state) => state.selectedElementId === id);

  // Lấy thông số vật liệu
  const mat = MATERIAL_DEFINITIONS[materialId] || { color: defaultColor, metalness: 0.5, roughness: 0.5 };

  const getGeometry = () => {
    switch (geometry) {
      case 'CYLINDER': return <cylinderGeometry args={args} />;
      case 'CONE': return <coneGeometry args={args} />;
      default: return <boxGeometry args={args} />;
    }
  };

  return (
    <mesh 
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(id);
      }}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={isSelected ? "#f472b6" : mat.color} 
        metalness={mat.metalness} 
        roughness={mat.roughness} 
      />
    </mesh>
  );
};

export default GenericElement;