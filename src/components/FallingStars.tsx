import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic star colors based on stellar classification
const STAR_COLORS = [
  '#9bb0ff', // O-type: Blue-white (very hot)
  '#aabfff', // B-type: Blue-white (hot)
  '#cad7ff', // A-type: White (hot)
  '#f8f7ff', // F-type: Yellow-white (medium hot)
  '#fff4ea', // G-type: Yellow (like our Sun)
  '#ffcc6f', // K-type: Orange (cool)
  '#ffad51'  // M-type: Red (coolest)
];

const FallingStar = ({ 
  position, 
  color, 
  speed, 
  size 
}: { 
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && trailRef.current) {
      // Move star downward
      meshRef.current.position.y -= speed * delta;
      trailRef.current.position.y -= speed * delta;
      
      // Reset position when star falls below screen
      if (meshRef.current.position.y < -20) {
        meshRef.current.position.y = 20;
        trailRef.current.position.y = 20;
      }
      
      // Add subtle rotation and glow pulsing
      meshRef.current.rotation.x += delta * 2;
      meshRef.current.rotation.y += delta * 1.5;
      
      // Pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      meshRef.current.scale.setScalar(pulse * size);
    }
  });

  return (
    <group position={position}>
      {/* Fire trail effect */}
      <mesh ref={trailRef} position={[0, 2, 0]}>
        <coneGeometry args={[0.1, 4, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Main star with fire effect */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Particle effects */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={new Float32Array(
              Array.from({ length: 60 }, () => (Math.random() - 0.5) * 2)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.1}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const FallingStars = () => {
  const stars = useMemo(() => {
    return STAR_COLORS.map((color, index) => ({
      id: index,
      position: [
        (Math.random() - 0.5) * 30, // Random X position
        Math.random() * 40 + 10,    // Start above screen
        (Math.random() - 0.5) * 20  // Random Z position
      ] as [number, number, number],
      color,
      speed: Math.random() * 3 + 2, // Random fall speed
      size: Math.random() * 0.5 + 0.5 // Random size
    }));
  }, []);

  return (
    <group>
      {stars.map((star) => (
        <FallingStar
          key={star.id}
          position={star.position}
          color={star.color}
          speed={star.speed}
          size={star.size}
        />
      ))}
    </group>
  );
};

export default FallingStars;