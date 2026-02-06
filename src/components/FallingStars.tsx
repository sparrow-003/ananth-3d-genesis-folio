import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Sparkles } from '@react-three/drei';
import { useAnimationPreference } from '@/contexts/AnimationContext';

// Stellar classification colors for realism
const STELLAR_PALETTE = {
  O: '#9bb0ff', // Deep Blue (Hot)
  B: '#aabfff', // Blue White
  A: '#cad7ff', // White Blue
  F: '#fff4ea', // Yellow White
  G: '#fff5f2', // White (Sun-like)
  K: '#ffcc6f', // Orange
  M: '#ff5a44', // Red-Orange (Cooler)
};

const METEOR_COLORS = [
  '#00f2ff', // Cyan Neon
  '#ffffff', // Pure White
  '#ff9d00', // Amber/Orange
  '#0066ff', // Deep Blue
];

interface MeteorProps {
  id: number;
}

const CinematicMeteor = ({ id }: MeteorProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const sparkRef = useRef<THREE.Points>(null);

  // Randomize initial meteor characteristics
  const config = useMemo(() => {
    const isBig = Math.random() > 0.8;
    return {
      speed: (isBig ? 0.4 : 0.2) + Math.random() * 0.3,
      size: isBig ? 0.8 : 0.3,
      color: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
      angle: (Math.random() - 0.5) * 0.4,
      curvature: (Math.random() - 0.5) * 0.02, // Path curve intensity
      z: (Math.random() - 0.5) * 20,
      sparkCount: isBig ? 40 : 15,
      trailLength: isBig ? 12 : 6,
    };
  }, []);

  const [state] = useState({
    x: (Math.random() - 0.5) * 50,
    y: 20 + Math.random() * 15,
    active: true,
    flareY: (Math.random() - 0.1) * 10, // Point where it flares
  });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse influence (Gravitational Bending)
    const mouseX = state.mouse.x * 10;
    const mouseY = state.mouse.y * 10;
    const dx = meshRef.current.position.x - mouseX;
    const dy = meshRef.current.position.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, (20 - dist) / 20) * 0.1;

    // Movement with subtle curvature and mouse influence
    state.y -= config.speed * delta * 60;
    state.x += (Math.sin(state.y * 0.05) + config.curvature * state.y + dx * influence) * 0.1;

    // Flare effect logic
    const distanceToFlare = Math.abs(state.y - state.flareY);
    const flareIntensity = Math.max(0, (5 - distanceToFlare) / 5);
    const flareScale = 1 + flareIntensity * 2;

    meshRef.current.position.set(state.x, state.y, config.z);

    // Rotate meteor to face the direction of travel for realism
    const targetRotation = Math.atan2(dx * influence, -config.speed);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation, 0.1);

    // Apply flare scale to the head
    meshRef.current.scale.set(flareScale, flareScale, flareScale);

    // Stretch trail based on speed and add wobble
    if (trailRef.current) {
      const wobble = Math.sin(state.clock.elapsedTime * 20 + id) * 0.05;
      trailRef.current.scale.set(1 + wobble, config.trailLength * (config.speed * 2), 1);
    }

    // Reset loop
    if (state.y < -25) {
      state.y = 25 + Math.random() * 10;
      state.x = (Math.random() - 0.5) * 60;
    }
  });

  // Memoize the canvas texture to prevent re-creation
  const trailTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, config.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [config.color]);

  return (
    <group ref={meshRef} rotation={[0, 0, config.angle]}>
      {/* Meteor Head (Core) */}
      <mesh>
        <sphereGeometry args={[config.size * 0.2, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Primary Glow */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[config.size * 0.2, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Kinetic Trail (The Streak) */}
      <mesh ref={trailRef} position={[0, config.trailLength * 0.5, 0]}>
        <planeGeometry args={[config.size * 0.4, 1]} />
        <meshBasicMaterial
          map={trailTexture}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spark Detritus (Sparkles component for premium feel) */}
      <Sparkles
        count={config.sparkCount}
        scale={config.size * 2}
        size={2}
        speed={0.5}
        opacity={0.8}
        color={config.color}
      />
    </group>
  );
};

// Rich Starfield with depth and variations
const CinematicStarfield = () => {
  const { effectiveMode } = useAnimationPreference();
  const starCount = effectiveMode === 'full' ? 400 : 150;

  const [positions, colors, sizes] = useMemo(() => {
    const p = new Float32Array(starCount * 3);
    const c = new Float32Array(starCount * 3);
    const s = new Float32Array(starCount);

    const types = Object.values(STELLAR_PALETTE);

    for (let i = 0; i < starCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = -20 - Math.random() * 50;

      const color = new THREE.Color(types[Math.floor(Math.random() * types.length)]);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;

      s[i] = Math.random() * (i % 10 === 0 ? 0.3 : 0.1); // Occasional bright stars
    }
    return [p, c, s];
  }, [starCount]);

  const starsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!starsRef.current) return;
    const time = clock.elapsedTime;
    const sizeAttr = starsRef.current.geometry.attributes.size;
    const sizeArr = sizeAttr.array as Float32Array;

    for (let i = 0; i < sizeArr.length; i++) {
      // Twinkle logic
      sizeArr[i] = sizes[i] * (0.8 + Math.sin(time * 2 + i * 10) * 0.4);
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={starCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={starCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={starCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

const FallingStars = () => {
  const { effectiveMode } = useAnimationPreference();

  if (effectiveMode === 'off') return null;

  const meteorCount = effectiveMode === 'full' ? 15 : 6;

  return (
    <group>
      {/* Background depth layers */}
      <CinematicStarfield />

      {/* Volumetric ambient glow using Drei's Float for organic drift */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          {Array.from({ length: meteorCount }).map((_, i) => (
            <CinematicMeteor key={i} id={i} />
          ))}
        </group>
      </Float>

      <ambientLight intensity={0.2} />
    </group>
  );
};

export default FallingStars;
