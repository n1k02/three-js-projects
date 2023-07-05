
// let model
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import {TextureLoader} from "three";

const loadModels = async () => {

    const loading = document.getElementById('loading')
    loading.style.display = 'flex'


    // let model
    const e36 = new URL('../assets/e36-no-wheels.glb', import.meta.url)
    const e36_wheel = new URL('../assets/rx7_wheel.glb', import.meta.url)
    const track_url = new URL('../assets/track.glb', import.meta.url)
    const ramp_url = new URL('../assets/ramp.glb', import.meta.url)
    const textureUrl = new URL('../assets/track.png', import.meta.url)
    const loader = new GLTFLoader();
    const dLoader = new DRACOLoader()
    dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dLoader)

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(textureUrl.href, (texture) => {
        return texture
    }, null, (e)=> {
        console.log(e)
    })

    const loadModel = () => {
        return new Promise((resolve) => {
            loader.load(e36.href, function (gltf) {
                const model = gltf.scene;
                model.children[0].rotation.z -= Math.PI / 2;
                model.scale.set(0.2,0.2,0.2)
                model.children[0].position.set(0, -3.2, 0);
                // model.children[0].position.set(0, -0.5, -3.45);
                model.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.material.envMapIntensity = 3;
                    }
                });
                resolve(model);
            });
        });
    };

    const loadWheelModels = () => {
        return new Promise((resolve) => {
            loader.load(e36_wheel.href, function (gltf) {
                const wheelModel = gltf.scene;
                wheelModel.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.material.envMapIntensity = 3;
                    }
                });

                let wheelModel1Group = new THREE.Group();
                let wheelModel2Group = new THREE.Group();
                let wheelModel3Group = new THREE.Group();
                let wheelModel4Group = new THREE.Group();

                let wheelModel1 = wheelModel.clone();
                wheelModel1.children[0].rotation.y -= -1.58;
                wheelModel1.position.set(0,0,0.1)
                wheelModel1Group.add(wheelModel1);

                let wheelModel2 = wheelModel.clone();
                wheelModel2.children[0].rotation.y += -1.58;
                wheelModel2.position.set(0,0,-0.1)
                wheelModel2Group.add(wheelModel2);

                let wheelModel3 = wheelModel.clone();
                wheelModel3.children[0].rotation.y -= -1.58;
                wheelModel3.position.set(0,0,0.1)
                wheelModel3Group.add(wheelModel3);

                let wheelModel4 = wheelModel.clone();
                wheelModel4.children[0].rotation.y += -1.58;
                wheelModel4.position.set(0,0,-0.1)
                wheelModel4Group.add(wheelModel4);
                const wheelModels = []
                wheelModels.push(wheelModel1Group);
                wheelModels.push(wheelModel2Group);
                wheelModels.push(wheelModel3Group);
                wheelModels.push(wheelModel4Group);

                resolve(wheelModels);
            });
        });
    };

    const loadTrack = () => {
        return new Promise((resolve) => {
            loader.load(track_url.href, function (gltf) {
                const track = gltf.scene;
                // track.children[0].rotation.z -= Math.PI / 2;
                track.scale.set(15,15,15)
                track.children[0].material.map = texture
                track.children[0].material.needsUpdate = true
                track.children[0].position.set(0, 0.004,0);
                track.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true
                        node.material.envMapIntensity = 20;
                    }
                });
                resolve(track);
            });
        });
    };

    const loadRamp = () => {
        return new Promise((resolve) => {
            loader.load(ramp_url.href, function (gltf) {
                const ramp = gltf.scene;
                resolve(ramp);
            });
        });
    };

        const model = await loadModel();
        const wheelModels = await loadWheelModels();
        const track = await loadTrack()
        const ramp = await loadRamp()
        loading.style.display = 'none'
        return {model, wheelModels, track, ramp}

}

export default loadModels

