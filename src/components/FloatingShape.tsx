
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

  // Create material separately to avoid the "lov" property error
  const material = {
    roughness: 0.2,
    metalness: 0.8,
    emissive: color,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.8,
    color: color
  };

  // Render appropriate shape based on prop with proper material application
  switch (shape) {
    case 'octahedron':
      return (
        <Octahedron ref={meshRef} args={[size, 0]} position={position}>
          <meshStandardMaterial {...material} />
        </Octahedron>
      );
    case 'tetrahedron':
      return (
        <Tetrahedron ref={meshRef} args={[size, 0]} position={position}>
          <meshStandardMaterial {...material} />
        </Tetrahedron>
      );
    case 'icosahedron':
      return (
        <Icosahedron ref={meshRef} args={[size, 0]} position={position}>
          <meshStandardMaterial {...material} />
        </Icosahedron>
      );
    case 'sphere':
      return (
        <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
          <meshStandardMaterial {...material} />
        </Sphere>
      );
    case 'torus':
      return (
        <Torus ref={meshRef} args={[size, size/3, 16, 32]} position={position}>
          <meshStandardMaterial {...material} />
        </Torus>
      );
    default:
      return (
        <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
          <meshStandardMaterial {...material} />
        </Sphere>
      );
  }
};

export default FloatingShape;
