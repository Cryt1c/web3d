import React, { useEffect, useRef } from "react";
import "./App.css";
import {
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
  resizeResults,
  createCanvasFromMedia,
  matchDimensions,
  Point,
} from "face-api.js";

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

const calcPupil = (points: Point[]) => {
  const sum = points.reduce(
    (acc, cur) => new Point(cur.x + acc.x, cur.y + acc.y)
  );
  return new Point(sum.x / points.length, sum.y / points.length);
};

const App = () => {
  const videoElement = useRef<HTMLVideoElement>();

  const handlePlay = () => {
    let canvas, displaySize;
    if (videoElement.current?.width && videoElement.current?.height) {
      canvas = createCanvasFromMedia(videoElement.current);
      document.body.append(canvas);
      displaySize = {
        width: videoElement?.current?.width,
        height: videoElement?.current?.height,
      };
    }
    matchDimensions(canvas, displaySize);

    loadModels()
      .then(() => {
        matchDimensions(canvas, displaySize);
        setInterval(async () => {
          const detections = await detectSingleFace(
            videoElement.current,
            new TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
          ).withFaceLandmarks();
          if (canvas && displaySize) {
            canvas
              .getContext("2d")
              .clearRect(0, 0, canvas.width, canvas.height);
            const resizedDimensions = resizeResults(detections, displaySize);
            const leftEye = calcPupil(resizedDimensions.landmarks.getLeftEye());
            const rightEye = calcPupil(
              resizedDimensions.landmarks.getRightEye()
            );
            canvas
              .getContext("2d")
              .fillRect(leftEye.x - 5, leftEye.y - 5, 10, 10);
            canvas
              .getContext("2d")
              .fillRect(rightEye.x - 5, rightEye.y - 5, 10, 10);
          }
        }, 100);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    startVideo(videoElement.current);
    return () => {};
  }, []);

  return (
    <>
      <video
        ref={videoElement}
        width="720"
        height="560"
        autoPlay
        muted
        onPlay={handlePlay}
      ></video>
    </>
  );
};

export default App;
