import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Environment,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";

const TexturedCube = () => {
  const cubeRef = useRef();

  const { scale } = useSpring({
    loop: false,
    to: { scale: 4 },
    from: { scale: 1 },
    config: { duration: 1500 },
  });

  // Animation: Rotate cube
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.01; // Rotate on Y-axis
    }
  });

  return (
    <animated.mesh
      ref={cubeRef}
      scale-x={scale}
      scale-y={scale}
      scale-z={scale}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </animated.mesh>
  );
};
const L = () => {
  return (
    <>
      <Canvas camera={{ position: [5, 5, 5] }}>
        {/* Global Effects */}
        <Suspense fallback={null}>
          <Environment preset="sunset" background />
        </Suspense>

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Textured Cube */}
        <TexturedCube />

        <OrbitControls enableZoom={true} />
      </Canvas>

      {/* Loading Progress Bar */}
      <Loader />
    </>
  );
};

export default L;
