import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from 'dat.gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as YUKA from 'yuka'
import {sRGBEncoding, TubeBufferGeometry} from "three";

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#111111')
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 5, 10)
orbit.update()


///////////////// axs helper /////////////////
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)


///////////////// grid helper /////////////////
// const gridHelper = new THREE.GridHelper(30)
// scene.add(gridHelper)



///////////////// ambient light /////////////////
const ambientLight = new THREE.AmbientLight('#ffffff', 1)
ambientLight.position.set(0, 20, 0)
scene.add(ambientLight)


///////////////// directional light /////////////////
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(directionalLight)
directionalLight.position.set(0, 10, 10)
directionalLight.castShadow = true
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


///////////////// import 3d models /////////////////
// const assetLoader = new GLTFLoader()
// assetLoader.load(MODEL_NAME.href, (gltf) => {
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



// creating mesh
// const vehicleMesh = new THREE.Mesh(
//     new THREE.ConeBufferGeometry(0.1, 0.5, 8).rotateX(Math.PI * 0.5),
//     new THREE.MeshNormalMaterial()
// )
// vehicleMesh.matrixAutoUpdate = false // to not let threejs update the position of vehicle
// scene.add(vehicleMesh)


renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 10

// creating vehicle by mesh
const vehicle = new YUKA.Vehicle()

let pos = new THREE.Vector3()
function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix)
    renderComponent.getWorldPosition(pos)
    camera.lookAt(pos.x, pos.y, pos.z)
}


// manager to update the vehicle (on animation loop)
const entityManager = new  YUKA.EntityManager()
entityManager.add(vehicle)


// SeekBehaviour

const targetMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({color: 0x001100})
)
targetMesh.matrixAutoUpdate = false
scene.add(targetMesh)

const target = new YUKA.GameEntity()
target.setRenderComponent(targetMesh, sync)
entityManager.add(target)

// const seekBehavior = new YUKA.SeekBehavior(target.position) // (path, (distance when the vehicle starts to steer))
const arriveBehavior = new YUKA.ArriveBehavior(target.position, 3, 1.5) // (path, (distance when the vehicle starts to steer))
arriveBehavior.weight = 1

// vehicle.mass = 1
vehicle.steering.add(arriveBehavior)
vehicle.boundingRadius = 4
vehicle.position.set(-10,0,-10)
vehicle.maxForce = 2000
vehicle.maxSpeed = 100
vehicle.smoother = new YUKA.Smoother(50)

setInterval(()=> {
    const x = Math.random() * 7
    const y = Math.random() * 7
    const z = Math.random() * 7
    target.position.set(x,y,z)
}, 4000)



const assetLoader = new GLTFLoader()
assetLoader.load('./assets/su-30sm/scene.gltf', (gltf) => {
    const model = gltf.scene
    scene.add(model)
    model.matrixAutoUpdate = false
    vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5)
    vehicle.setRenderComponent(model, sync)
}, undefined, (err) => {
    console.log(err)
})



const time = new YUKA.Time()

const animate = () => {
    const delta = time.update().getDelta()
    entityManager.update(delta) // update vehicle

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})