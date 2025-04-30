
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import FloatingShape from './FloatingShape';

const Canvas3D = () => {
  return (
    <div className="canvas-container">
      <Canvas dpr={[1, 2]} shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
          
          {/* Floating shapes with different positions, rotations, and sizes */}
          <FloatingShape position={[3, 1, -5]} size={1} color="#9b87f5" shape="octahedron" speed={1} />
          <FloatingShape position={[-4, 2, -10]} size={1.5} color="#7E69AB" shape="tetrahedron" speed={0.7} />
          <FloatingShape position={[0, -2, -8]} size={1.2} color="#D6BCFA" shape="icosahedron" speed={0.5} />
          <FloatingShape position={[-2, -1, -5]} size={0.8} color="#8B5CF6" shape="sphere" speed={1.2} />
          <FloatingShape position={[4, -3, -12]} size={2} color="#9b87f5" shape="torus" speed={0.3} />
          
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
