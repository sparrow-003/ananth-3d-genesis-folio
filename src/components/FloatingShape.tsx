
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

  // Fix: Don't use the spread operator or material object, use the props directly
  const renderShape = () => {
    switch (shape) {
      case 'octahedron':
        return (
          <Octahedron ref={meshRef} args={[size, 0]} position={position}>
            <meshStandardMaterial 
              roughness={0.2} 
              metalness={0.8} 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              transparent={true} 
              opacity={0.8} 
            />
          </Octahedron>
        );
      case 'tetrahedron':
        return (
          <Tetrahedron ref={meshRef} args={[size, 0]} position={position}>
            <meshStandardMaterial 
              roughness={0.2} 
              metalness={0.8} 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              transparent={true} 
              opacity={0.8} 
            />
          </Tetrahedron>
        );
      case 'icosahedron':
        return (
          <Icosahedron ref={meshRef} args={[size, 0]} position={position}>
            <meshStandardMaterial 
              roughness={0.2} 
              metalness={0.8} 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              transparent={true} 
              opacity={0.8} 
            />
          </Icosahedron>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} args={[size, size/3, 16, 32]} position={position}>
            <meshStandardMaterial 
              roughness={0.2} 
              metalness={0.8} 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              transparent={true} 
              opacity={0.8} 
            />
          </Torus>
        );
      case 'sphere':
      default:
        return (
          <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
            <meshStandardMaterial 
              roughness={0.2} 
              metalness={0.8} 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.2} 
              transparent={true} 
              opacity={0.8} 
            />
          </Sphere>
        );
    }
  };

  return renderShape();
};

export default FloatingShape;
