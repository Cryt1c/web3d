import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

import React, { useRef } from "react";

const Camera = ({ position }) => {
  useFrame(({ camera }) => {
    camera.position.set(position.x, position.y, position.z);
  });
  return null;
};

const ReactScene = ({ position }) => {
  const perspectiveCam = useRef();

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas>
        <Camera position={position}></Camera>
        <PerspectiveCamera
          makeDefault
          name="3d"
          ref={perspectiveCam}
          position={[0, 0, 3]}
          fov={90}
        />
        <ambientLight intensity={0.1} position={[10, 20, 0]} />
        <ambientLight color={0xffffff} intensity={0.6}></ambientLight>
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={0xfb8e00} />
        </mesh>
        <mesh position={[-5, -5, -3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={0xfb8e00} />
        </mesh>
        <mesh position={[5, 5, -4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={0xfb8e00} />
        </mesh>
        <gridHelper />
      </Canvas>
    </div>
  );
};

export default ReactScene;
