import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Realistic star colors based on stellar classification
const STAR_COLORS = [
  '#ffffff', // Bright white
  '#aabfff', // Blue-white (hot)
  '#cad7ff', // White-blue
  '#fff4ea', // Yellow-white
  '#ffcc6f', // Orange
  '#9bb0ff', // Deep blue
];

interface MeteorProps {
  initialPosition: [number, number, number];
  color: string;
  speed: number;
  size: number;
  angle: number;
  delay: number;
}

const Meteor = ({ initialPosition, color, speed, size, angle, delay }: MeteorProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const isActive = useRef(false);
  const startTime = useRef(0);
  
  // Trail particle positions
  const trailPositions = useMemo(() => {
    const positions = new Float32Array(90); // 30 particles * 3
    const sizes = new Float32Array(30);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = i * 0.3; // Trail behind
      positions[i * 3 + 2] = 0;
      sizes[i] = Math.max(0.05, size * (1 - i / 30) * 0.8);
    }
    return { positions, sizes };
  }, [size]);

  // Animate on mount with GSAP
  useEffect(() => {
    if (groupRef.current) {
      startTime.current = delay;
      gsap.to(groupRef.current.position, {
        duration: 0,
        delay: delay,
        onComplete: () => {
          isActive.current = true;
        }
      });
    }
  }, [delay]);

  useFrame((state, delta) => {
    if (!groupRef.current || !isActive.current) return;
    
    const elapsed = state.clock.elapsedTime;
    
    // Movement direction based on angle
    const moveX = Math.sin(angle) * speed * delta * 60;
    const moveY = -Math.cos(angle) * speed * delta * 60;
    
    groupRef.current.position.x += moveX;
    groupRef.current.position.y += moveY;
    
    // Reset when out of view
    if (groupRef.current.position.y < -25 || 
        groupRef.current.position.x > 25 || 
        groupRef.current.position.x < -25) {
      groupRef.current.position.set(
        (Math.random() - 0.5) * 40,
        25 + Math.random() * 10,
        (Math.random() - 0.5) * 15
      );
    }
    
    // Pulsing glow effect
    if (coreRef.current && glowRef.current) {
      const pulse = Math.sin(elapsed * 8 + delay * 10) * 0.3 + 1;
      coreRef.current.scale.setScalar(size * pulse);
      glowRef.current.scale.setScalar(size * 3 * pulse);
      
      // Flickering intensity
      const material = coreRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.9 + Math.sin(elapsed * 15) * 0.1;
    }
    
    // Update trail particles
    if (trailRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 29; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3] - moveX * 0.5;
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1] - moveY * 0.5;
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
      }
      positions[0] = 0;
      positions[1] = 0;
      positions[2] = 0;
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={initialPosition} rotation={[0, 0, angle]}>
      {/* Core bright point */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Particle trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={30}
            array={trailPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={30}
            array={trailPositions.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.15}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      {/* Streak/tail effect */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[0.08, 3]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Background twinkling stars
const BackgroundStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = -10 - Math.random() * 20;
      
      // Star colors
      const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
      const color = new THREE.Color(STAR_COLORS[colorIndex]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.elapsedTime;
      const sizesAttr = starsRef.current.geometry.attributes.size;
      const sizesArray = sizesAttr.array as Float32Array;
      
      for (let i = 0; i < sizesArray.length; i++) {
        sizesArray[i] = sizes[i] * (0.7 + Math.sin(time * 2 + i) * 0.3);
      }
      sizesAttr.needsUpdate = true;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={200}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Nebula/dust clouds for depth
const SpaceDust = () => {
  const dustRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = -5 - Math.random() * 15;
    }
    
    return positions;
  }, []);
  
  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });
  
  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4a5568"
        size={0.5}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

const FallingStars = () => {
  const meteors = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        15 + Math.random() * 20,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      speed: 0.15 + Math.random() * 0.25,
      size: 0.3 + Math.random() * 0.5,
      angle: (Math.random() - 0.5) * 0.5, // Slight angle variation
      delay: Math.random() * 3
    }));
  }, []);

  return (
    <group>
      {/* Deep space background */}
      <BackgroundStars />
      <SpaceDust />
      
      {/* Falling meteors */}
      {meteors.map((meteor) => (
        <Meteor
          key={meteor.id}
          initialPosition={meteor.position}
          color={meteor.color}
          speed={meteor.speed}
          size={meteor.size}
          angle={meteor.angle}
          delay={meteor.delay}
        />
      ))}
      
      {/* Ambient space glow */}
      <ambientLight intensity={0.1} />
    </group>
  );
};

export default FallingStars;
