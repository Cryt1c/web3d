import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import React, { useRef } from "react";

const deg2rad = (degrees) => degrees * (Math.PI / 180);

const Camera = () => {
  useFrame(({ camera }) => {
    // camera.rotation.set(0, camera.rotation.y + deg2rad(1), 0);
  });
  return null;
};

const ReactScene = () => {
  const perspectiveCam = useRef();

  return (
    <div style={{ position: "relative", width: 1920, height: 800 }}>
      <Canvas>
        <Camera></Camera>
        <PerspectiveCamera
          makeDefault
          name="3d"
          ref={perspectiveCam}
          position={[0, 1, 1]}
          fov={150}
        />
        <ambientLight intensity={0.1} position={[10, 20, 0]} />
        <ambientLight color={0xffffff} intensity={0.6}></ambientLight>
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={0xfb8e00} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ReactScene;
