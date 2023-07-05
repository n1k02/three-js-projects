import * as THREE from "three";

const addLights = (scene) => {

    // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    // ambientLight.position.set(10, 10, 10)
    // scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x000000, 1);
    pointLight.position.set(0, 20, 0);
    pointLight.castShadow = true
    pointLight.shadow.mapSize.set(2048, 2048)
    scene.add(pointLight);

///////////////// fog /////////////////
// scene.fog = new THREE.Fog('#ffffff', 0, 200)
// scene.fog = new THREE.FogExp2('#ffffff', 0.01)

    /////////////// directional light /////////////////
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
// scene.add(directionalLight)
// directionalLight.position.set(0, 30, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12
//
// /////////////// dr-light helper /////////////////
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)
//
// /////////////// dr-light shadow helper /////////////////
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)


///////////////// spotlight /////////////////
// const spotLight = new THREE.SpotLight('#ffffff')
// scene.add(spotLight)
// spotLight.position.set(-100, 100, 0)
// spotLight.castShadow = true
// spotLight.angle = 0.2

///////////////// sLight helper /////////////////
// const sLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(sLightHelper)
}
export default addLights