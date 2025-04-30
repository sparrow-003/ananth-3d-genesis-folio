
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import FloatingShape from './FloatingShape';

const Canvas3D = () => {
  return (
    <div className="canvas-container h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Reduced from 1.5 to 2 for better performance
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <FloatingShape position={[3, 1, -5]} size={1} color="#9b87f5" shape="sphere" speed={1} />
          <FloatingShape position={[-4, 2, -10]} size={1.5} color="#7E69AB" shape="octahedron" speed={0.7} />
          <FloatingShape position={[0, -2, -8]} size={1.2} color="#D6BCFA" shape="icosahedron" speed={0.5} />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;
