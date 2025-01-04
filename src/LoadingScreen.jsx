import { useProgress } from "@react-three/drei";
import React from "react";

const LoadingScreen = () => {
  const { progress } = useProgress();
  return <div className="loading">Loading....({parseInt(progress)}%)</div>;
};

export default LoadingScreen;
