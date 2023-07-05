import React, {useMemo} from 'react';
import {useBox, useCompoundBody, usePlane, useTrimesh} from "@react-three/cannon";
import {meshBounds, MeshReflectorMaterial} from "@react-three/drei";
import {useLoader} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {BufferAttribute} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";

const Ground = () => {
    const track = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "/models/track.glb"
    );
    const geometry = track.scene.children[0].geometry;
    geometry.scale(2,2,2)
    const { attributes, index } = geometry;

    let vertices = attributes.position.array;
    let indices = index.array;


    const [ref] = useTrimesh(() => ({
        type: 'Static',
        args: [vertices, indices],
    }));


    // const [ref] = usePlane(
    //     () => ({
    //             type: 'Static',
    //             rotation: [-Math.PI / 2, 0, 0] }
    //     ),
    //     useRef(null)
    // );
    const gridMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/grid.png"
    );


    const alphaMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/alpha-map.png"
    );
    useEffect(() => {
        if (!gridMap) return;

        gridMap.anisotropy = 16;
    }, [gridMap]);

    const meshRef = useRef(null);
    const meshRef2 = useRef(null);

    // useEffect(() => {
    //     if (!meshRef.current) return;
    //
    //     var uvs = meshRef.current.geometry.attributes.uv.array;
    //     meshRef.current.geometry.setAttribute("uv2", new BufferAttribute(uvs, 2));
    //
    //     var uvs2 = meshRef2.current.geometry.attributes.uv.array;
    //     meshRef2.current.geometry.setAttribute("uv2", new BufferAttribute(uvs2, 2));
    // }, [meshRef.current]);
    return (
        <>
            <mesh
                ref={ref}
                position={[-2.285, -0.01, -1.325]}
            >
                {/*<planeGeometry args={[12, 12]} />*/}
                <bufferGeometry attach="geometry" {...geometry} />
{/*                <meshBasicMaterial
                    opacity={0.325}
                    alphaMap={gridMap}
                    transparent={true}
                    color={"white"}
                />*/}
                <meshStandardMaterial attach="material" color="orange" />
            </mesh>
            {/*<mesh*/}
            {/*    ref={meshRef}*/}
            {/*    position={[-2.285, -0.015, -1.325]}*/}
            {/*    rotation-x={-Math.PI * 0.5}*/}
            {/*    rotation-z={-0.079}*/}
            {/*>*/}
            {/*    <circleGeometry args={[30, 50]}/>*/}
            {/*    <MeshReflectorMaterial*/}
            {/*        alphaMap={alphaMap}*/}
            {/*        transparent={true}*/}
            {/*        color={[0.5, 0.5, 0.5]}*/}
            {/*        envMapIntensity={0.35}*/}
            {/*        metalness={0.05}*/}
            {/*        roughness={0.4}*/}

            {/*        dithering={true}*/}
            {/*        blur={[1024, 512]} // Blur ground reflections (width, heigt), 0 skips blur*/}
            {/*        mixBlur={3} // How much blur mixes with surface roughness (default = 1)*/}
            {/*        mixStrength={30} // Strength of the reflections*/}
            {/*        mixContrast={1} // Contrast of the reflections*/}
            {/*        resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower*/}
            {/*        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors*/}
            {/*        depthScale={0} // Scale the depth factor (0 = no depth, default = 0)*/}
            {/*        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)*/}
            {/*        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)*/}
            {/*        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [bl*/}
            {/*        debug={0}*/}
            {/*        reflectorOffset={0.02} // Offsets the virtual camera that projects the reflection. Useful when the reflective*/}
            {/*    ></MeshReflectorMaterial>*/}
            {/*</mesh>*/}
        </>
    );
};

export default Ground;