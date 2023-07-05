import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'cannon-es'
import Debugger from 'cannon-es-debugger'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";


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

const axsHelper = new THREE.AxesHelper(8)
scene.add(axsHelper)

// grid
// const grid = new THREE.GridHelper(30, 30)
// scene.add(grid)

// light
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
// ambientLight.position.set(0, 20, 0)
// scene.add(ambientLight)


const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
})

const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(), // infinity ground plane
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    material: new CANNON.Material('groundMaterial')
})
physicsWorld.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)


const carBody = new CANNON.Body({
    mass: 50,
    position: new CANNON.Vec3(0, 6, 0),
    shape: new CANNON.Box(new CANNON.Vec3(6, 0.5, 2)),
})
const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody,
})


const mass = 1
const axisWidth = 5
const wheelShape = new CANNON.Sphere(1)
const wheelMaterial = new CANNON.Material('wheelMaterial');
const down = new CANNON.Vec3(0, -1, 0)

const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundBody.material, {
    friction: 0.3,
    restitution: 1
});
// physicsWorld.addContactMaterial(wheelGroundContactMaterial)


const wheelBody1 = new CANNON.Body({mass, material: wheelMaterial})
wheelBody1.addShape(wheelShape)
wheelBody1.angularDamping = 0.3
vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(-3, 0, axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
    frictionSlip: 10, // Коэффициент скольжения
    suspensionStiffness: 10, // Жесткость подвески
    suspensionRestLength: 2, // Длина покоя подвески
    suspensionDamping: 4, // Амортизация подвески
})
const wheelBody2 = new CANNON.Body({mass, material: wheelMaterial})
wheelBody2.addShape(wheelShape)
wheelBody2.angularDamping = 0.3
vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(-3, 0, -axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
    frictionSlip: 10, // Коэффициент скольжения
    suspensionStiffness: 10, // Жесткость подвески
    suspensionRestLength: 2, // Длина покоя подвески
    suspensionDamping: 4, // Амортизация подвески

})
const wheelBody3 = new CANNON.Body({mass, material: wheelMaterial})
wheelBody3.addShape(wheelShape)
wheelBody3.angularDamping = 0.9
vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(3, 0, axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,
    frictionSlip: 10, // Коэффициент скольжения
    suspensionStiffness: 10, // Жесткость подвески
    suspensionRestLength: 2, // Длина покоя подвески
    suspensionDamping: 4, // Амортизация подвески

})
const wheelBody4 = new CANNON.Body({mass, material: wheelMaterial})
wheelBody4.addShape(wheelShape)
wheelBody4.angularDamping = 0.9
vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(3, 0, -axisWidth / 2),
    axis: new CANNON.Vec3(0, 0, 1),
    direction: down,


})


// let model
// const rx7 = new URL('../assets/rx7.glb', import.meta.url)
// const loader = new GLTFLoader();
// const dLoader = new DRACOLoader()
// dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
// loader.setDRACOLoader(dLoader)
// loader.load(
//     rx7.href,
//     function (gltf) {
//         model = gltf.scene
//         model.children[0].rotation.z -= Math.PI / 2
//         scene.add(model)
//     })

vehicle.addToWorld(physicsWorld)


//controls
document.addEventListener('keydown', (event) => {
    const maxSteerVal = Math.PI / 5
    const maxForce = 200

    switch (event.key) {
        case 'w':
            vehicle.setWheelForce(maxForce, 2)
            vehicle.setWheelForce(maxForce, 3)
            break
        case 's':
            vehicle.setWheelForce(-maxForce / 1.5, 2)
            vehicle.setWheelForce(-maxForce / 1.5, 3)
            break
        case 'a':
            vehicle.setSteeringValue(maxSteerVal, 0)
            vehicle.setSteeringValue(maxSteerVal, 1)
            break
        case 'd':
            vehicle.setSteeringValue(-maxSteerVal, 0)
            vehicle.setSteeringValue(-maxSteerVal, 1)
            break
        case 'space':

            break
    }
})
document.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'w':
            vehicle.setWheelForce(0, 2)
            vehicle.setWheelForce(0, 3)
            break
        case 's':
            vehicle.setWheelForce(0, 2)
            vehicle.setWheelForce(0, 3)
            break
        case 'a':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break
        case 'd':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break
    }
})


const cannonDebugger = new Debugger(scene, physicsWorld)

const timeStep = 1 / 60

const animate = () => {
    physicsWorld.step(timeStep)
    cannonDebugger.update()

    // if (model) {
    //     model.position.copy(new THREE.Vector3(carBody.position.x + 3, carBody.position.y, carBody.position.z - 3.5))
    //     model.quaternion.copy(carBody.quaternion)
    // }

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})