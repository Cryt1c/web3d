import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import React from "react";

const ReactScene = () => {
  return (
    <Canvas className="fiber">
      <ambientLight intensity={0.1} position={[10, 20, 0]} />
      <ambientLight color={0xffffff} intensity={0.6}></ambientLight>
      <directionalLight color="red" position={[0, 0, 5]} />
      {/* <PerspectiveCamera
        makeDefault
        position={[0, 0, -10]}
        fov={45}
        aspect={720 / 400}
      /> */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={0xfb8e00} />
      </mesh>
    </Canvas>
  );
};

export default ReactScene;
