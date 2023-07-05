import {useBox, useCylinder, useRaycastVehicle} from "@react-three/cannon";
import {useFrame, useLoader} from "@react-three/fiber";
import {useEffect, useRef, useState} from "react";
import {Quaternion, Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import React from 'react';
import {useWheels} from "./useWheels";
import {WheelDebug} from "./WheelDebug";
import {useControls} from "./useControls";
import {Box} from "@react-three/drei";

const Car = () => {
    const [model, setModel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
            loader.setDRACOLoader(dracoLoader);

            loader.load(
                process.env.PUBLIC_URL + '/models/e36-no-wheels.glb',
                function (gltf) {
                    const model = gltf.scene;
                    model.scale.set(0.2,0.2,0.2)
                    setModel(model);
                    setIsLoading(false);
                    // Делайте что-то с загруженной моделью
                },
                undefined,
                function (error) {
                    console.error('Ошибка загрузки модели:', error);
                    setIsLoading(false);
                }
            );
        }, []
    )
    const position = [-1.5, 3, 3];
    const width = 1.5;
    const height = -0.3;
    const  back = 1.3;
    const front = -1.47;
    const wheelRadius = 0.35;
    const wheelWidth = 0.25

    const chassisBodyArgs = [width, height, -front + back + 0.8];
    const [chassisBody, chassisApi] = useBox(
        () => ({
            args: chassisBodyArgs,
            mass: 150,
            position,
        }),
        useRef(null),
    );
    const [wheels, wheelInfos] = useWheels(width, height, front,back, wheelRadius, wheelWidth);
    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos,
            wheels,
        }),
        useRef(null),
    );

    useControls(vehicleApi, chassisApi);


    return (

        <group ref={vehicle} name="vehicle">
            <group ref={chassisBody} name="chassisBody">

                {model ? <primitive object={model} rotation-y={Math.PI} position={[0, -0.5, 0]}/> : null}
            </group>

{/*             <mesh ref={chassisBody}>
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh>*/}

            <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} wheelWidth={wheelWidth} />
            <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} wheelWidth={wheelWidth} />
            <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} wheelWidth={wheelWidth} />
            <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} wheelWidth={wheelWidth} />
        </group>

    );
};

export default Car;