
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
    
    // Create more dramatic floating animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.004;
    meshRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.002;
    
    // Enhanced rotation for more dramatic effect
    meshRef.current.rotation.x += 0.003 * speed;
    meshRef.current.rotation.y += 0.004 * speed;
    meshRef.current.rotation.z += 0.001 * speed;
  });

  const wireframe = Math.random() > 0.7;

  // Material props shared across all shapes
  const materialProps = {
    roughness: 0.1,
    metalness: 0.9,
    color: color,
    emissive: color,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.8,
    wireframe: wireframe
  };

  // Render the appropriate shape
  switch (shape) {
    case 'octahedron':
      return (
        <Octahedron 
          ref={meshRef} 
          args={[size, 0]} 
          position={position} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </Octahedron>
      );
    case 'tetrahedron':
      return (
        <Tetrahedron 
          ref={meshRef} 
          args={[size, 0]} 
          position={position} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </Tetrahedron>
      );
    case 'icosahedron':
      return (
        <Icosahedron 
          ref={meshRef} 
          args={[size, 1]} 
          position={position} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </Icosahedron>
      );
    case 'torus':
      return (
        <Torus 
          ref={meshRef} 
          args={[size, size/3, 16, 32]} 
          position={position} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </Torus>
      );
    case 'sphere':
    default:
      return (
        <Sphere 
          ref={meshRef} 
          args={[size, 32, 32]} 
          position={position} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      );
  }
};

export default FloatingShape;
