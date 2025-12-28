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
  text?: string;
  rotation?: [number, number, number];
}

const FloatingShape = ({ position, size, color, shape, speed, rotation = [0, 0, 0] }: FloatingShapeProps) => {
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

  // Create a shared standard material with better visual appeal
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color).multiplyScalar(0.4),
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8,
    wireframe: wireframe
  });

  // Render the appropriate shape with initial rotation
  const renderShape = () => {
    switch (shape) {
      case 'octahedron':
        return (
          <group rotation={[rotation[0], rotation[1], rotation[2]]}>
            <Octahedron 
              ref={meshRef} 
              args={[size, 0]} 
              position={position} 
              castShadow 
              receiveShadow
              material={material}
            />
          </group>
        );
      case 'tetrahedron':
        return (
          <group rotation={[rotation[0], rotation[1], rotation[2]]}>
            <Tetrahedron 
              ref={meshRef} 
              args={[size, 0]} 
              position={position} 
              castShadow 
              receiveShadow
              material={material}
            />
          </group>
        );
      case 'icosahedron':
        return (
          <group rotation={[rotation[0], rotation[1], rotation[2]]}>
            <Icosahedron 
              ref={meshRef} 
              args={[size, 1]} 
              position={position} 
              castShadow 
              receiveShadow
              material={material}
            />
          </group>
        );
      case 'torus':
        return (
          <group rotation={[rotation[0], rotation[1], rotation[2]]}>
            <Torus 
              ref={meshRef} 
              args={[size, size/3, 16, 32]} 
              position={position} 
              castShadow 
              receiveShadow
              material={material}
            />
          </group>
        );
      case 'sphere':
      default:
        return (
          <group rotation={[rotation[0], rotation[1], rotation[2]]}>
            <Sphere 
              ref={meshRef} 
              args={[size, 32, 32]} 
              position={position} 
              castShadow 
              receiveShadow
              material={material}
            />
          </group>
        );
    }
  };

  return renderShape();
};

export default FloatingShape;
