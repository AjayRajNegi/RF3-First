import React from "react";
import { useRef } from "react";
import CustomObject from "./CustomObject";
import { useFrame } from "@react-three/fiber";
import {
  Text,
  Html,
  Float,
  PivotControls,
  OrbitControls,
  TransformControls,
  MeshReflectorMaterial,
} from "@react-three/drei";

function Experience() {
  const cubeRef = useRef();
  const sphereRef = useRef();
  const groupRef = useRef();
  useFrame((state, delta) => {
    // const angle = state.clock.elapsedTime;
    // state.camera.position.x = Math.sin(angle) * 8;
    // state.camera.position.z = Math.cos(angle) * 8;
    // state.camera.lookAt(0, 0, 0);
    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta;
  });
  return (
    <>
      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={3.5} />
      <ambientLight intensity={1} />

      <group ref={groupRef}>
        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          fixed={true}
          scale={50}
        >
          <mesh position-x={-2} ref={sphereRef}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
            <Html
              position={[1, 1, 0]}
              wrapperClass="label"
              center
              distanceFactor={6}
              occlude={[sphereRef, cubeRef]}
            >
              That's a 3D Sphere.
            </Html>
          </mesh>
        </PivotControls>
        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" wireframe={false} />
        </mesh>
        {/* <TransformControls object={cubeRef} mode="translate" /> */}
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <meshStandardMaterial color="greenyellow" /> */}
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.75}
        />
      </mesh>

      {/* <CustomObject /> */}
      <Float speed={5}>
        <Text fontSize={1} color="salmon" maxWidth={3} textAlign="center">
          This Is R3F.
        </Text>
      </Float>
    </>
  );
}

export default Experience;
