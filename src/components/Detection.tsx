import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import {
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
  resizeResults,
  createCanvasFromMedia,
  matchDimensions,
  Point,
} from "face-api.js";
import { Scene } from "./Scene";

const loadModels = async () => {
  await nets.tinyYolov2.loadFromUri("/models");
  await nets.tinyFaceDetector.loadFromUri("/models");
  await nets.faceLandmark68TinyNet.loadFromUri("/models");
  await nets.faceLandmark68Net.loadFromUri("/models");
  // await nets.ssdMobilenetv1.loadFromUri("/models");
  // await nets.faceRecognitionNet.loadFromUri("/models");
};

const startVideo = (video) => {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => console.error(err));
};

const calcPointAverage = (points: Point[]): Point => {
  const sum = points.reduce(
    (acc, cur) => new Point(cur.x + acc.x, cur.y + acc.y)
  );
  return new Point(sum.x / points.length, sum.y / points.length);
};

const Detection = () => {
  const videoElement = useRef<HTMLVideoElement>();
  const [eye, setEye] = useState<any>();
  const [distance, setDistance] = useState<number>();
  const [showScene, setShowScene] = useState(false);

  const handlePlay = async () => {
    let canvas, displaySize;
    if (videoElement.current?.width && videoElement.current?.height) {
      canvas = createCanvasFromMedia(videoElement.current);
      const root = document.querySelector("#root");
      root.append(canvas);
      displaySize = {
        width: videoElement?.current?.width,
        height: videoElement?.current?.height,
      };
    }
    matchDimensions(canvas, displaySize);

    await loadModels();
    matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await detectSingleFace(
        videoElement.current,
        new TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
      ).withFaceLandmarks();
      if (canvas && displaySize && detections) {
        const resizedDimensions = resizeResults(detections, displaySize);
        const leftEye = calcPointAverage(
          resizedDimensions.landmarks.getLeftEye()
        );
        const rightEye = calcPointAverage(
          resizedDimensions.landmarks.getRightEye()
        );
        if (!showScene) {
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          canvas.getContext("2d").fillRect(leftEye.x, leftEye.y, 10, 10);
          canvas.getContext("2d").fillRect(rightEye.x, rightEye.y, 10, 10);
        }

        if (leftEye && rightEye) {
          setEye(calcPointAverage([leftEye, rightEye]));
          setDistance(rightEye.sub(leftEye).magnitude());
        }
      }
    }, 100);
  };

  useEffect(() => {
    startVideo(videoElement.current);
    return () => {};
  }, []);

  return (
    <>
      <button onClick={() => setShowScene(!showScene)}>Show Scene</button>
      <video
        ref={videoElement}
        width="720"
        height="560"
        autoPlay
        muted
        onPlay={handlePlay}
      ></video>
      {showScene && <Scene viewPoint={eye} distance={distance}></Scene>}
    </>
  );
};

export default Detection;
