import React, {Suspense} from 'react';
import {Box, Environment, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import Track from "./Track";
import Ground from "./Ground";
import Car from "./Car";
import {ColliderBox} from "./ColliderBox";

const Scene = () => {
    return (
        <Suspense>
            <Environment
                files={process.env.PUBLIC_URL + '/textures/envmap.hdr'}
                background={true}
            />
            <PerspectiveCamera makeDefault position={[-6, 3.9, 6.21]} fov={45}/>
            <OrbitControls target={[-2.64, -0.71, 0.03]}/>

            {/*<Box args={[1,1,1]}/>*/}
            <Car/>
            {/*<Track/>*/}
            <Ground/>
        </Suspense>
    );
};

export default Scene;