
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import FloatingShape from './FloatingShape';

const Canvas3D = () => {
  return (
    <div className="canvas-container h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff0040" />
          
          <FloatingShape position={[5, 2, -8]} size={1.5} color="#ff0040" shape="octahedron" speed={0.8} />
          <FloatingShape position={[-6, 3, -12]} size={2} color="#0040ff" shape="icosahedron" speed={0.5} />
          <FloatingShape position={[0, -3, -10]} size={1.7} color="#00ff40" shape="tetrahedron" speed={0.6} />
          <FloatingShape position={[-4, -2, -6]} size={1.2} color="#ffaa00" shape="sphere" speed={0.9} />
          <FloatingShape position={[6, -1, -14]} size={1.8} color="#aa00ff" shape="torus" speed={0.7} />
          
          <Stars radius={50} depth={50} count={1000} factor={4} saturation={1} fade speed={1} />
          <Environment preset="night" />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.3}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Canvas3D;
