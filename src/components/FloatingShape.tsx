
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
  
  // Define the material once to avoid issues
  const material = <meshStandardMaterial 
    roughness={0.2} 
    metalness={0.8} 
    color={color} 
    emissive={color} 
    emissiveIntensity={0.2} 
    transparent={true} 
    opacity={0.8} 
  />;
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Create floating animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    
    // Slow rotation
    meshRef.current.rotation.x += 0.002 * speed;
    meshRef.current.rotation.y += 0.003 * speed;
  });

  // Simplified shape rendering with appropriate props
  switch (shape) {
    case 'octahedron':
      return <Octahedron ref={meshRef} args={[size, 0]} position={position}>{material}</Octahedron>;
    case 'tetrahedron':
      return <Tetrahedron ref={meshRef} args={[size, 0]} position={position}>{material}</Tetrahedron>;
    case 'icosahedron':
      return <Icosahedron ref={meshRef} args={[size, 0]} position={position}>{material}</Icosahedron>;
    case 'torus':
      return <Torus ref={meshRef} args={[size, size/3, 16, 32]} position={position}>{material}</Torus>;
    case 'sphere':
    default:
      return <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>{material}</Sphere>;
  }
};

export default FloatingShape;
