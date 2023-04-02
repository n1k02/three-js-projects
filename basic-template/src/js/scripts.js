import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

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
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
// ambientLight.position.set(0, 20, 0)
// scene.add(ambientLight)


// create three js objects
// const groundGeo = new THREE.PlaneGeometry(30, 30)
// const groundMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     wireframe: true
// })
// const groundMesh = new THREE.Mesh(groundGeo, groundMat)
// scene.add(groundMesh)


// const boxGeo = new THREE.BoxGeometry(2,2,2)
// const boxMat = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     side: THREE.DoubleSide,
//     wireframe: true
// })
// const boxMesh = new THREE.Mesh(boxGeo, boxMat)
// scene.add(boxMesh)

// const sphereGeo = new THREE.SphereGeometry(2)
// const sphereMat = new THREE.MeshBasicMaterial({
//     color: 0xff0000,
//     side: THREE.DoubleSide,
//     wireframe: true
// })
// const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
// scene.add(sphereMesh)


const animate = () => {

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})