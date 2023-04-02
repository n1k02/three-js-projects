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
const grid = new THREE.GridHelper(20, 20)
scene.add(grid)

// light
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
// ambientLight.position.set(0, 20, 0)
// scene.add(ambientLight)


// create three js objects
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false,
        // wireframe: true
    })
)
planeMesh.rotateX(-Math.PI * 0.5)
scene.add(planeMesh)
planeMesh.name = "ground"

const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
        // wireframe: true
    })
)
highlightMesh.rotateX(-Math.PI * 0.5)
highlightMesh.position.set(0.5, 0, 0.5)
scene.add(highlightMesh)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersects;

// intersect + add 1x1 plane
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mousePosition, camera)
    intersects = raycaster.intersectObjects(scene.children)
    intersects.forEach(intersect => {
        if (intersect.object.name === 'ground') {
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5)
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z)

            const objectExist = objects.find(obj => obj.position.x === highlightMesh.position.x && obj.position.z === highlightMesh.position.z)
            if (!objectExist)
                highlightMesh.material.color.setHex(0xffffff)
            else
                highlightMesh.material.color.setHex(0xff0000)
        }
    })
})


const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        color: 0xffea00,
        side: THREE.DoubleSide,
        wireframe: true,
    })
)

//create objects on click
const objects = []
window.addEventListener('mousedown', (e) => {
    const objectExist = objects.find(obj => obj.position.x === highlightMesh.position.x && obj.position.z === highlightMesh.position.z)
    if (objectExist) return
    intersects.forEach(intersect => {
        if (intersect.object.name === 'ground') {
            const sphereClone = sphereMesh.clone()
            sphereClone.position.copy(highlightMesh.position)
            scene.add(sphereClone)
            objects.push(sphereClone)
            highlightMesh.material.color.setHex(0xff0000)
        }
    })
})


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


const animate = (time) => {

    highlightMesh.material.opacity = 1.3 + Math.sin(time / 120)

    objects.forEach(obj => {
        obj.rotation.x = time / 1000
        obj.rotation.y = time / 1000
        obj.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000))
    })


    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})