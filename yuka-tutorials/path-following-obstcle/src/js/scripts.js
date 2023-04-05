import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from 'dat.gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as YUKA from 'yuka'
import {sRGBEncoding} from "three";
import * as Skeleton from "three/examples/jsm/utils/SkeletonUtils.js";

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
orbit.enableDamping = true
orbit.dampingFactor = 1
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


// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.5

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



// manager to update the vehicle (on animation loop)
const entityManager = new  YUKA.EntityManager()
entityManager.add(vehicle)


// set standard behavior
const followPathBehavior = new YUKA.FollowPathBehavior(path, 1) // (path, (distance when the vehicle starts to steer))
vehicle.steering.add(followPathBehavior)

// to set more control of behavior
const onPathBehavior = new YUKA.OnPathBehavior(path)
onPathBehavior.predictionFactor = 0.3
onPathBehavior.radius = 5
onPathBehavior.weight = 1
vehicle.steering.add(onPathBehavior)


vehicle.maxSpeed = 3
vehicle.smoother = new YUKA.Smoother(10)



// pursuit behavior
const chaser1 = new YUKA.Vehicle()
const chaser2 = new YUKA.Vehicle()
entityManager.add(chaser1)
entityManager.add(chaser2)

// const pursuitBehavior = new YUKA.PursuitBehavior(vehicle, 3 )
const pursuitBehavior1 = new YUKA.OffsetPursuitBehavior(vehicle, new YUKA.Vector3(-1,0,0))
const pursuitBehavior2 = new YUKA.OffsetPursuitBehavior(vehicle, new YUKA.Vector3(1,0,0))
chaser1.steering.add(pursuitBehavior1)
chaser2.steering.add(pursuitBehavior2)

chaser1.maxSpeed = 10
chaser2.maxSpeed = 10



const assetLoader = new GLTFLoader()
assetLoader.load('./assets/rx7/source/rx7.glb', (gltf) => {
    const model = gltf.scene
    scene.add(model)
    const model2 = Skeleton.clone(model)
    scene.add(model2)
    const model3 = Skeleton.clone(model)
    scene.add(model3)
    vehicle.boundingRadius = 1.5

    model.matrixAutoUpdate = false
    vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5)
    vehicle.setRenderComponent(model, sync)

    model2.matrixAutoUpdate = false
    chaser1.scale = new YUKA.Vector3(0.5,0.5,0.5)
    chaser1.setRenderComponent(model2, sync)

    model3.matrixAutoUpdate = false
    chaser2.scale = new YUKA.Vector3(0.5,0.5,0.5)
    chaser2.setRenderComponent(model3, sync)
    // model.position.set(-12, 0, 10)
}, undefined, (err) => {
    console.log(err)
})



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




// obstacle
const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const obstacleMaterial = new THREE.MeshPhongMaterial()

const obstacleMesh1 = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
scene.add(obstacleMesh1)
obstacleMesh1.position.set(-2, 0 ,5)
const obstacleMesh2 = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
scene.add(obstacleMesh2)
obstacleMesh2.position.set(-5, 0 ,-2)
const obstacleMesh3 = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
scene.add(obstacleMesh3)
obstacleMesh3.position.set(5, 0 , -2)

const obstacle1 = new YUKA.GameEntity()
obstacle1.position.copy(obstacleMesh1.position)
obstacle1.boundingRadius = 2
const obstacle2 = new YUKA.GameEntity()
obstacle2.position.copy(obstacleMesh2.position)
obstacle2.boundingRadius = 2
const obstacle3 = new YUKA.GameEntity()
obstacle3.position.copy(obstacleMesh3.position)
obstacle3.boundingRadius = 2

const obstacles = []
obstacles.push(obstacle1, obstacle2, obstacle3)

const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
vehicle.steering.add(obstacleAvoidanceBehavior)



const vehiclePos = new YUKA.Vector3()

const time = new YUKA.Time()

const animate = () => {

    const delta = time.update().getDelta()
    entityManager.update(delta) // update vehicle

    // camera.lookAt(vehicle.position.x, vehicle.position.y, vehicle.position.z)

    renderer.render(scene, camera)
}



renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})