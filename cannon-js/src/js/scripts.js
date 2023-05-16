import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'cannon-es'

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

// grid
// const grid = new THREE.GridHelper(30, 30)
// scene.add(grid)

// light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
ambientLight.position.set(0, 20, 0)
scene.add(ambientLight)


// create three js objects
const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
scene.add(groundMesh)


const boxGeo = new THREE.BoxGeometry(2,2,2)
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    wireframe: true
})
const boxMesh = new THREE.Mesh(boxGeo, boxMat)
scene.add(boxMesh)

const sphereGeo = new THREE.SphereGeometry(2)
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    wireframe: true
})
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphereMesh)


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
})

// create the physical bodies
// material
const groundPhysMat = new CANNON.Material()
// body
const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(), // infinity ground plane
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)), // half size
    type: CANNON.Body.STATIC,
    material: groundPhysMat
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const boxPhysMat = new CANNON.Material()

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)), // half of object's size
    position: new CANNON.Vec3(5, 20 ,0),
    material: boxPhysMat
})
world.addBody(boxBody)

boxBody.angularVelocity.set(0, 3, 0)
boxBody.angularDamping = 0.5

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {
        friction: 0.04
    }
)
world.addContactMaterial(groundBoxContactMat)


const spherePhysMat = new CANNON.Material()

const sphereBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Sphere(2), // the same radius
    position: new CANNON.Vec3(0, 15 ,0),
    material: spherePhysMat
})
world.addBody(sphereBody)

sphereBody.linearDamping = 0.31

const groundSphereContactMat = new CANNON.ContactMaterial(
    spherePhysMat,
    groundPhysMat,
    // ball will be jumping
    {
       restitution: 0.9
    }
)
world.addContactMaterial(groundSphereContactMat)




// constrain
const size = 0.5
const space = size * 0.1
const mass = 1
const N = 10
const shape = new CANNON.Box(new CANNON.Vec3(size, size, size))

const geo = new THREE.BoxBufferGeometry()
const mat = new THREE.MeshPhongMaterial({color: 0xFFEA00})

const meshesArray = []
const bodiesArray = []

let previous

for (let i = 0; i < N; i++) {
    const boxBody = new CANNON.Body({
        shape,
        mass,
        position: new CANNON.Vec3(-(N-i-N/2) * (size * 2 + space * 2), 3, 0)
    })
    world.addBody(boxBody)
    bodiesArray.push(boxBody)

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    meshesArray.push(mesh)

    if(previous) {
        const lockConstraint = new CANNON.LockConstraint(boxBody, previous)
        world.addConstraint(lockConstraint)
    }


    previous = boxBody

}

const leftBody = new CANNON.Body({
    mass: 0,
    shape,
    position: new CANNON.Vec3(-(N/2) * (size * 2 + space * 2), 0, 0)
})
world.addBody(leftBody)
bodiesArray.push(leftBody)

const leftMesh = new THREE.Mesh(geo, mat)
scene.add(leftMesh)
meshesArray.push(leftMesh)

const rightBody = new CANNON.Body({
    mass: 0,
    shape,
    position: new CANNON.Vec3(-(-N/2+1) * (size * 2 + space * 2), 0, 0)
})
world.addBody(rightBody)
bodiesArray.push(rightBody)

const rightMesh = new THREE.Mesh(geo, mat)
scene.add(rightMesh)
meshesArray.push(rightMesh)


const timeStep = 1 / 60

const animate = () => {
    world.step(timeStep)

    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)

    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)



    // constrain
    for (let i = 0; i < meshesArray.length; i++) {
        meshesArray[i].position.copy(bodiesArray[i].position)
        meshesArray[i].quaternion.copy(bodiesArray[i].quaternion)

    }


    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})