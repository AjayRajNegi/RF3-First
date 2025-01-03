import { Suspense } from "react";
import EarthCanvas from "./Earth";
import L from "./L";

const Loading = () => {
  return (
    <div>
      <p className="loading">Main Loading Screen</p>
    </div>
  );
};

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <EarthCanvas />
        {/* <L /> */}
      </Suspense>
    </>
  );
}
export default App;
