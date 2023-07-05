import { useCompoundBody } from "@react-three/cannon";
import {useMemo, useRef} from "react";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";


export const useWheels = (width, height, front, back, radius, wheelWidth) => {
  const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const model = useLoader(
      GLTFLoader,
      process.env.PUBLIC_URL + "/models/wheel.gltf"
  );

  const wheelInfo = {
    radius,
    // directionLocal: [0, -1, 0],
    // axleLocal: [1, 0, 0],
    // suspensionStiffness: 100,
    // suspensionRestLength: 0.15,
    // frictionSlip: 1,
    // dampingRelaxation: 3,
    // dampingCompression:5,
    // maxSuspensionForce: 10000000,
    // rollInfluence: 0.01,
    // maxSuspensionTravel: 0.1,
    // customSlidingRotationalSpeed: -30,
    // useCustomSlidingRotationalSpeed: true,

    directionLocal: [0, -1, 0],
    suspensionStiffness: 100,
    suspensionRestLength: 0.1,
    frictionSlip:1,
    dampingRelaxation: 3,
    dampingCompression: 6,
    maxSuspensionForce:10000,
    rollInfluence: 0.5,
    axleLocal: [1, 0, 0],
    chassisConnectionPointLocal: [0,0,0],
    maxSuspensionTravel: 0.1,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true
  };

  const wheelInfos = [
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, height, back],
      isFrontWheel: true,
      frictionSlip: 1
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, height, back],
      isFrontWheel: true,
      frictionSlip: 1
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, height,  front ],
      isFrontWheel: false,


    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, height,   front],
      isFrontWheel: false,


    },
  ];

  const propsFunc = () => ({
    collisionFilterGroup: 1,
    mass: 1,
    shapes: [
      {
        args: [wheelInfo.radius, wheelInfo.radius, wheelWidth, 20],
        rotation: [0, 0, -Math.PI / 2],
        type: "Cylinder",
      },
    ],
    type: "Dynamic",
  });


  useCompoundBody(propsFunc, wheels[0]);
  useCompoundBody(propsFunc, wheels[1]);
  useCompoundBody(propsFunc, wheels[2]);
  useCompoundBody(propsFunc, wheels[3]);

  return [wheels, wheelInfos];
};
