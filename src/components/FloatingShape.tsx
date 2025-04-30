
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Octahedron, Tetrahedron, Icosahedron, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  size: number;
  color: string;
  shape: 'octahedron' | 'tetrahedron' | 'icosahedron' | 'sphere' | 'torus';
  speed: number;
}

const FloatingShape = ({ position, size, color, shape, speed }: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Create floating animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    
    // Slow rotation
    meshRef.current.rotation.x += 0.002 * speed;
    meshRef.current.rotation.y += 0.003 * speed;
  });

  // Create material directly instead of as JSX to avoid Three.js prop issues
  const materialProps = {
    color,
    roughness: 0.2,
    metalness: 0.8,
    emissive: color,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.8
  };

  // Render appropriate shape based on prop
  switch (shape) {
    case 'octahedron':
      return <Octahedron args={[size, 0]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
    case 'tetrahedron':
      return <Tetrahedron args={[size, 0]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
    case 'icosahedron':
      return <Icosahedron args={[size, 0]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
    case 'sphere':
      return <Sphere args={[size, 16, 16]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
    case 'torus':
      return <Torus args={[size, size/3, 16, 32]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
    default:
      return <Sphere args={[size, 16, 16]} position={position} ref={meshRef} material={new THREE.MeshStandardMaterial(materialProps)} />;
  }
};

export default FloatingShape;
