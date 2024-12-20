import Earth from "./Earth";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <>
      <Canvas camera={{ position: [12, 5, 1], fov: 25, near: 0.1, far: 100 }}>
        <Earth />
      </Canvas>
    </>
  );
}
export default App;
