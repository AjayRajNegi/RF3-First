import React, { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import * as THREE from "three";

const ResizeHandler = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      gl.setSize(width, height);
      console.log(camera, gl);
    };

    //Add event handler
    window.addEventListener("resize", handleResize);

    handleResize();

    //Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, gl]); //Depend on camera and gl(renderer)

  return null; //This component doesn't render anything visually.
};

const Earth = () => {
  const sphereRef = useRef();
  const clock = new THREE.Clock();
  useFrame((state, delta) => {
    const elapsedTime = clock.getElapsedTime();
    sphereRef.current.rotation.y = elapsedTime * 0.1;
  });

  return (
    <>
      <ResizeHandler />
      <OrbitControls />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          fragmentShader={earthFragmentShader}
          vertexShader={earthVertexShader}
        />
        <directionalLight position={[3, 3, 3]} intensity={0.5} color="blue" />
      </mesh>
    </>
  );
};

export default Earth;
