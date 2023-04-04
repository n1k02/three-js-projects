import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from 'dat.gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as YUKA from 'yuka'

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#222222')
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
const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
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


// creating vehicle by mesh
const vehicle = new YUKA.Vehicle()

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix)
}

// path
const path = new YUKA.Path()
path.add(new YUKA.Vector3(-4, 0, 4))
path.add(new YUKA.Vector3(-6, 0, 0))
path.add(new YUKA.Vector3(-4, 0, -4))
path.add(new YUKA.Vector3(0, 0, 0))
path.add(new YUKA.Vector3(4, 0, -4))
path.add(new YUKA.Vector3(6, 0, 0))
path.add(new YUKA.Vector3(4, 0, 4))
path.add(new YUKA.Vector3(0, 0, 6))

// infinite loop
path.loop = true

// set first _waypoint
vehicle.position.copy(path.current())

// set standard behavior
const followPathBehavior = new YUKA.FollowPathBehavior(path, 3) // (path, (distance when the vehicle starts to steer))
vehicle.steering.add(followPathBehavior)

// to set more control of behavior
const onPathBehavior = new YUKA.OnPathBehavior(path)
// onPathBehavior.predictionFactor = 0.3
// onPathBehavior.radius = 0.5
onPathBehavior.weight = 2
vehicle.steering.add(onPathBehavior)

vehicle.maxSpeed = 3


// manager to update the vehicle (on animation loop)
const entityManager = new  YUKA.EntityManager()
entityManager.add(vehicle)


const assetLoader = new GLTFLoader()
assetLoader.load('./assets/rx7/source/rx7.glb', (gltf) => {
    const model = gltf.scene
    scene.add(model)
    model.matrixAutoUpdate = false
    vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5)
    vehicle.setRenderComponent(model, sync)
    // model.position.set(-12, 0, 10)
}, undefined, (err) => {
    console.log(err)
})


// creating mesh
// const vehicleMesh = new THREE.Mesh(
//     new THREE.ConeBufferGeometry(0.1, 0.5, 8).rotateX(Math.PI * 0.5),
//     new THREE.MeshNormalMaterial()
// )
// vehicleMesh.matrixAutoUpdate = false // to not let threejs update the position of vehicle
// scene.add(vehicleMesh)




// path rendering
const position = []
for (let i = 0; i < path._waypoints.length; i++) {
    const waypoint = path._waypoints[i]
    position.push(waypoint.x, waypoint.y, waypoint.z)
}

const lineGeometry = new THREE.BufferGeometry()
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))

const lineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00})
const lines = new THREE.LineLoop(lineGeometry, lineMaterial)
scene.add(lines)

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