import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from 'dat.gui'
// import * as SkeletonUtiols from 'three/examples/jsm/utils/SkeletonUtils.js'
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setClearColor('#a3a3a3')
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(10, 10, 10)
orbit.update()


///////////////// axs helper /////////////////
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)


///////////////// grid helper /////////////////
// const gridHelper = new THREE.GridHelper(30)
// scene.add(gridHelper)


///////////////// ambient light /////////////////
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
// ambientLight.position.set(0, 20, 0)
// scene.add(ambientLight)


///////////////// directional light /////////////////
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12

///////////////// dr-light helper /////////////////
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

///////////////// dr-light shadow helper /////////////////
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


///////////////// fog /////////////////
// scene.fog = new THREE.Fog('#ffffff', 0, 200)
// scene.fog = new THREE.FogExp2('#ffffff', 0.01)


///////////////// texture loaders /////////////////
// const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(img03)

// const cubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = cubeTextureLoader.load([img, img, img, img, img, img])


///////////////// plane /////////////////
// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(30, 30),
//     new THREE.MeshStandardMaterial({
//         color: 0xFFFFFF,
//         side: THREE.DoubleSide
//     }))
// scene.add(plane)
// plane.rotation.x = -0.5 * Math.PI
// plane.receiveShadow = true


///////////////// box /////////////////
// const boxMesh = new THREE.Mesh(
//     new THREE.BoxGeometry(2,2,2),
//     new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         side: THREE.DoubleSide,
//         wireframe: true
//     })
// )
// scene.add(boxMesh)


///////////////// sphere /////////////////
// const sphereMesh = new THREE.Mesh(
//     new THREE.SphereGeometry(2),
//     new THREE.MeshBasicMaterial({
//         color: 0xff0000,
//         side: THREE.DoubleSide,
//         wireframe: true
//     })
// )
// scene.add(sphereMesh)


///////////////// renderer color settings /////////////////
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 1.5


///////////////// import 3d models /////////////////
// const model = new URL('../assets/MODEL_NAME', import.meta.url)
// const assetLoader = new GLTFLoader()
// assetLoader.load(model.href, (gltf) => {
//     const model = gltf.scene
//     model.scale.set(2,2,2)
//     scene.add(model)
//     model.position.set(-12, 0, 10)
// }, undefined, (err) => {
//     console.log(err)
// })


///////////////// gui /////////////////
// const gui = new dat.GUI();
// const options = {
//
// }
// gui.addColor(options, '').onChange((e) => {
//     // change color (...color.set(e))
// })
// gui.add(options, '').onChange((e) => {
//     // change value (...= e)
// })


///////////////// get mouse pos /////////////////
// const mousePosition = new THREE.Vector2()
// window.addEventListener('mousemove', (e) => {
//     mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
//     mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
// })



// const clock = new THREE.Clock()

const animate = (time) => {


    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})