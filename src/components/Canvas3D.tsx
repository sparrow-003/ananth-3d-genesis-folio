
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import FloatingShape from './FloatingShape';

const Canvas3D = () => {
  return (
    <div className="canvas-container h-full">
      <Canvas
        shadows 
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 1.5]} // Optimized for performance
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* Simplified shapes setup */}
          <FloatingShape position={[3, 1, -5]} size={1} color="#9b87f5" shape="sphere" speed={1} />
          <FloatingShape position={[-4, 2, -10]} size={1.5} color="#7E69AB" shape="sphere" speed={0.7} />
          <FloatingShape position={[0, -2, -8]} size={1.2} color="#D6BCFA" shape="sphere" speed={0.5} />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;
