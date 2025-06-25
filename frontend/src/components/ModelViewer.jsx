import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  scene.scale.set(80, 80, 80); // 🔄 מותאם קצת לגודל ממוצע
  return <primitive object={scene} />;
};

const ModelViewer = ({ url }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative', // ❗ לא absolute, כדי לא לצאת מההיררכיה
        pointerEvents: 'none', // חשוב כדי שלא יחסום כפתורים
      }}
    >
      <Canvas camera={{ position: [0, 1, 8], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        <Suspense fallback={null}>
          <Model url={url} />
          <Environment preset="sunset" />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
