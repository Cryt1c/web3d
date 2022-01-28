import { Point } from "face-api.js";
import React from 'react'
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SceneInterface {
  viewPoint: Point;
}

export const Scene = ({ viewPoint }: SceneInterface) => {
  // Scene
  const scene = new THREE.Scene();

  // Add a cube to the scene
  const geometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth
  const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 20, 0); // x, y, z
  scene.add(directionalLight);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45, // left
    720/400, // right
    1, // top
    100, // bottom
  );

  camera.position.set(0, 0, -5);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(720, 400);
  renderer.render(scene, camera);

  const renderContainer = useRef<HTMLDivElement>();

  useEffect(() => {
    // Add it to HTML
    renderContainer?.current?.appendChild(renderer.domElement);

    return () => {};
  }, [renderer.domElement]);

  //Render loop
  const render = () => {
    if (viewPoint?.x && viewPoint?.y) {
      // Control
      let toleranceX = 0.02;
      let toleranceY = 0.02;

      let centerX = 720 * 0.5;
      let centerY = 560 * 0.5;

      console.log(viewPoint);
      camera.position.x = (viewPoint.x - centerX) * toleranceX;
      camera.position.y = (viewPoint.y - centerY) * toleranceY;
      camera.position.z = -10;
      camera.position.y = 0;
      camera.lookAt(0, 0, 0);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();

  return (
    <>
      <div ref={renderContainer}></div>
    </>
  );
};
