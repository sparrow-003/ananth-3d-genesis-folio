import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarPlaneProps {
  imageUrl: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const AvatarPlane = ({ imageUrl, position, rotation = [0, 0, 0], scale = 1 }: AvatarPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => new THREE.TextureLoader().load(imageUrl), [imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#10b981" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const GlowingRings = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ring2Ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

const Hero3DAvatar = () => {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#10b981" />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#14b8a6" />
        <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#ffffff" />
        
        <AvatarPlane 
          imageUrl="/assets/avatar-art-1.png" 
          position={[-1.5, 0, 0]} 
          rotation={[0, 0.2, 0]}
          scale={1}
        />
        <AvatarPlane 
          imageUrl="/assets/avatar-art-2.png" 
          position={[1.5, 0.2, -0.5]} 
          rotation={[0, -0.2, 0]}
          scale={0.9}
        />
        
        <ParticleField />
        <GlowingRings />
        
        <Environment preset="night" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Hero3DAvatar;
