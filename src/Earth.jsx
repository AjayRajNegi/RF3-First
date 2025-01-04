import * as THREE from "three";
import React, { Suspense, useEffect } from "react";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import { Stars, useProgress, useTexture } from "@react-three/drei";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";
import { motion } from "motion/react";
import LoadingScreen from "./LoadingScreen";

// Loading Component
// const LoadingComponent = () => {
//   const { progress } = useProgress();

//   return (
//     <div>
//       <p className="loading">Loading... ({parseInt(progress)}%)</p>
//     </div>
//   );
// };

// Earth Component
const Earth = ({ sunDirection }) => {
  const sphereRef = useRef();
  const shaderMaterialRef = useRef();

  // Load textures for the Earth
  const earthDayTexture = useTexture("/static/earth/day.jpg");
  const earthNightTexture = useTexture("/static/earth/night.jpg");
  const earthSpecularCloudsTexture = useTexture(
    "/static/earth/specularClouds.jpg"
  );

  // Optimize texture settings
  useMemo(() => {
    [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture].forEach(
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
      }
    );
  }, [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture]);

  // Animate the Earth and update shader uniforms every frame
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
    // Update the sun direction in the shader material
    shaderMaterialRef.current.uniforms.uSunDirection.value.copy(sunDirection);
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[2, 32, 32]} /> {/* Earth geometry */}
      <shaderMaterial
        ref={shaderMaterialRef}
        toneMapped={false}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
        uniforms={{
          uDayTexture: { value: earthDayTexture },
          uNightTexture: { value: earthNightTexture },
          uSpecularCloudsTexture: { value: earthSpecularCloudsTexture },
          uSunDirection: { value: sunDirection },
          uAtmosphereDayColor: { value: new THREE.Color("#00aaff") },
          uAtmosphereTwilightColor: { value: new THREE.Color("#ff6600") },
        }}
      />
    </mesh>
  );
};

// Sun Component
const Sun = ({ sunDirection }) => (
  <mesh position={sunDirection.clone().multiplyScalar(1)}>
    {/* Position based on sunDirection */}
    <icosahedronGeometry args={[0.1, 2]} />
    <meshBasicMaterial color="yellow" />
  </mesh>
);

// Atmosphere Component
const Atmosphere = ({ sunDirection }) => {
  const atmosphereRef = useRef(); // Ref for atmosphere shader material

  useFrame(() => {
    atmosphereRef.current.uniforms.uSunDirection.value.copy(sunDirection);
  });

  return (
    <mesh scale={1.04}>
      {/* Slightly larger than the Earth */}
      <sphereGeometry args={[2, 32, 32]} /> {/* Atmosphere geometry */}
      <shaderMaterial
        ref={atmosphereRef}
        toneMapped={false}
        side={THREE.BackSide}
        transparent={true}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={{
          uSunDirection: { value: sunDirection },
          uAtmosphereDayColor: { value: new THREE.Color("#00aaff") },
          uAtmosphereTwilightColor: { value: new THREE.Color("#ff6600") },
        }}
      />
    </mesh>
  );
};

// Animated Camera LookAt Component
const AnimatedCameraLookAt = ({ target }) => {
  const { camera } = useThree();
  const spring = useSpring({
    targetX: target[0],
    targetY: target[1],
    targetZ: target[2],
    config: { duration: 1000 },
  });

  // Use frame to interpolate camera lookAt
  useFrame(() => {
    if (camera) {
      const x = spring.targetX.get();
      const y = spring.targetY.get();
      const z = spring.targetZ.get();
      camera.lookAt(x, y, z);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};
// Main Canvas Component
const EarthCanvas = () => {
  const [lookAtTarget, setLookAtTarget] = React.useState([1, 7, 1]);
  const [scaleTarget, setScaleTarget] = React.useState(3.5);

  const handleChangeView = () => {
    setLookAtTarget([0, 0, 0]);
    setScaleTarget(1.5);
  };

  const { scale } = useSpring({
    scale: scaleTarget,
    config: { duration: 1000, tension: 170, friction: 25 },
  });

  // Calculate sun direction
  const sunDirection = useMemo(
    () => new THREE.Vector3(0, 0, 1).normalize(),
    []
  );
  // useEffect(() => {
  //   handleChangeView();
  //   console.log("useEffect");
  // }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="canvasMain">
        <div className="Hello">
          <div className="testing">
            <motion.div
              initial={{ x: -200, opacity: 1 }}
              animate={{ x: 200, opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              onAnimationStart={() => console.log("Animation Start")}
              onAnimationComplete={() => {
                handleChangeView();
                console.log("Animation End");
              }}
              className="loading"
            >
              Testing
            </motion.div>
          </div>
        </div>
        <div className="canva">
          <Canvas camera={{ position: [12, 5, 10], fov: 25 }} className="c">
            <AnimatedCameraLookAt target={lookAtTarget} />
            <animated.mesh scale={scale}>
              <Stars
                radius={1}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
              />

              {/* Replace Earth, Sun, and Atmosphere with your components */}
              <Earth sunDirection={sunDirection} />
              <Sun sunDirection={sunDirection} />
              <Atmosphere sunDirection={sunDirection} />
            </animated.mesh>
          </Canvas>
        </div>
        <div className="Hello">Hello</div>
      </div>
    </Suspense>
  );
};

export default EarthCanvas;
