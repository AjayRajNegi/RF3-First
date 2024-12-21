import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import { OrbitControls, useTexture } from "@react-three/drei";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";

const Earth = () => {
  const sphereRef = useRef();
  const debugSunRef = useRef();
  const shaderMaterialRef = useRef();
  const atmosphereRef = useRef();
  const clock = useMemo(() => new THREE.Clock(), []);

  /**
   * Earth
   */
  const earthParameters = {};
  earthParameters.atmosphereDayColor = "#00aaff";
  earthParameters.atmosphereTwilightColor = "#ff6600";

  //Load Textures
  const earthDayTexture = useTexture("/static/earth/day.jpg");
  earthDayTexture.colorSpace = THREE.SRGBColorSpace;
  earthDayTexture.anisotropy = 8;
  const earthNightTexture = useTexture("/static/earth/night.jpg");
  earthNightTexture.colorSpace = THREE.SRGBColorSpace;
  earthNightTexture.anisotropy = 8;
  const earthSpecularCloudsTexture = useTexture(
    "/static/earth/specularClouds.jpg"
  );
  earthSpecularCloudsTexture.anisotropy = 8;

  /**
   * Sun
   */
  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
  const sunDirection = new THREE.Vector3();

  // Update
  const updateSun = () => {
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical);

    // Debug
    debugSunRef.current.position.copy(sunDirection).multiplyScalar(1);

    // Uniforms
    shaderMaterialRef.current.uniforms.uSunDirection.value.copy(sunDirection);
    atmosphereRef.current.uniforms.uSunDirection.value.copy(sunDirection);
  };

  // Rotate the sphere over time
  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.y = elapsedTime * 0.1;
    }

    // Update the sun direction
    updateSun();
  });

  return (
    <>
      {/* Earth Mesh */}
      <OrbitControls />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          toneMapped={false}
          ref={shaderMaterialRef}
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={{
            uDayTexture: { value: earthDayTexture },
            uNightTexture: { value: earthNightTexture },
            uSpecularCloudsTexture: { value: earthSpecularCloudsTexture },
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            uAtmosphereDayColor: new THREE.Uniform(
              new THREE.Color(earthParameters.atmosphereDayColor)
            ),
            uAtmosphereTwilightColor: new THREE.Uniform(
              new THREE.Color(earthParameters.atmosphereTwilightColor)
            ),
          }}
        />
      </mesh>
      <mesh ref={debugSunRef}>
        <icosahedronGeometry args={[0.1, 2]} />
        <meshBasicMaterial />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          ref={atmosphereRef}
          toneMapped={false}
          side={THREE.BackSide}
          transparent={true}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            uAtmosphereDayColor: new THREE.Uniform(
              new THREE.Color(earthParameters.atmosphereDayColor)
            ),
            uAtmosphereTwilightColor: new THREE.Uniform(
              new THREE.Color(earthParameters.atmosphereTwilightColor)
            ),
          }}
        />
      </mesh>
    </>
  );
};

export default Earth;
