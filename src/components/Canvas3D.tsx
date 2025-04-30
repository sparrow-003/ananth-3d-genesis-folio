
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import FloatingShape from './FloatingShape';

// Simple fallback component for when the 3D canvas is loading
const CanvasLoader = () => (
  <div className="flex items-center justify-center h-full w-full bg-gradient-to-b from-dark to-purple/5">
    <div className="text-purple text-xl">Loading 3D scene...</div>
  </div>
);

// Error boundary component for 3D rendering issues
const Canvas3DErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="h-full w-full bg-gradient-to-b from-dark to-purple/5 flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-bold">3D rendering error</p>
          <p className="mt-2">Please try refreshing your browser.</p>
        </div>
      </div>
    );
  }
  
  // Use a try-catch for the children to handle synchronous errors
  try {
    return (
      <div className="h-full" onError={() => setHasError(true)}>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Error in Canvas3D:", error);
    setHasError(true);
    return (
      <div className="h-full w-full bg-gradient-to-b from-dark to-purple/5 flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-bold">3D rendering error</p>
          <p className="mt-2">Please try refreshing your browser.</p>
        </div>
      </div>
    );
  }
};

const Canvas3D = () => {
  return (
    <Canvas3DErrorBoundary>
      <div className="canvas-container h-full">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 65 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
          }}
          dpr={[1, 1.5]} // Reduced from [1, 2] for better performance
          shadows={false} // Disable shadows for better performance
          performance={{ min: 0.5 }} // Adjust for better performance
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff0040" />
            
            <FloatingShape position={[5, 2, -8]} size={1.5} color="#ff0040" shape="octahedron" speed={0.8} />
            <FloatingShape position={[-6, 3, -12]} size={2} color="#0040ff" shape="icosahedron" speed={0.5} />
            <FloatingShape position={[0, -3, -10]} size={1.7} color="#00ff40" shape="tetrahedron" speed={0.6} />
            <FloatingShape position={[-4, -2, -6]} size={1.2} color="#ffaa00" shape="sphere" speed={0.9} />
            <FloatingShape position={[6, -1, -14]} size={1.8} color="#aa00ff" shape="torus" speed={0.7} />
            
            <Stars radius={50} depth={50} count={500} factor={4} saturation={1} fade speed={1} />
            <Environment preset="night" />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              autoRotate
              autoRotateSpeed={0.3}
              makeDefault
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
        </Canvas>
      </div>
    </Canvas3DErrorBoundary>
  );
};

export default Canvas3D;
