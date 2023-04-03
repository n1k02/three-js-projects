import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui'
import img01 from '../img/01.jpg'
import img02 from '../img/02.jpg'
import img03 from '../img/03.jpg'
import img04 from '../img/04.jpg'
import bp from '../img/bp.jpg'

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DoubleSide} from "three";


// to clone 3D model
import * as SkeletonUtiols from 'three/examples/jsm/utils/SkeletonUtils.js'

const m8 = new URL('../assets/m8.glb', import.meta.url)


// Progress bar
const loadingManager = new THREE.LoadingManager()
const progressBar = document.getElementById('progress-bar')
loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100
}
const progressBarContainer = document.querySelector('.progress-bar-container')
loadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none'
}
const assetLoader = new GLTFLoader(loadingManager)


const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)
const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

camera.position.set(5, 12, 25)

orbit.update()
camera.lookAt(-10, 0, 5)
orbit.target.set(-10, 0, 5)

// box
// const boxGeometry = new THREE.BoxGeometry()
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0xFFaa00})
// const box = new THREE.Mesh(boxGeometry, boxMaterial)
// scene.add(box)


// plane
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true


// sphere
const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true


// light

// ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff)
// scene.add(ambientLight)

//directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12


// // dr-light helper
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2)
// scene.add(dLightHelper)
//
// // dr-light shadow helper
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)


// spotlight
const spotLight = new THREE.SpotLight('#ffffff')
scene.add(spotLight)
spotLight.position.set(-50, 50, 0)
spotLight.castShadow = true


// car light 1
const carSpotLight1 = new THREE.SpotLight('#ffffff')
scene.add(carSpotLight1)
carSpotLight1.position.set(-20, 20, 0)
carSpotLight1.castShadow = true
carSpotLight1.angle = 0.25
carSpotLight1.penumbra = 0.5
carSpotLight1.castShadow = true

// car light 2
const carSpotLight2 = new THREE.SpotLight('#333333')
scene.add(carSpotLight2)
carSpotLight2.position.set(-20, 20, 0)
carSpotLight2.castShadow = true
carSpotLight2.angle = 0.3
carSpotLight2.penumbra = 1
carSpotLight2.castShadow = true

// neon 1
const neonSpotLight1 = new THREE.SpotLight('#0000ff')
scene.add(neonSpotLight1)
neonSpotLight1.position.set(-5, 0.3, 10)
neonSpotLight1.castShadow = true
neonSpotLight1.penumbra = 0.04
neonSpotLight1.angle = 1.6

const targetObject1 = new THREE.Object3D();
scene.add(targetObject1);

targetObject1.position.set(-5, -1, 10)
neonSpotLight1.target = targetObject1;

// const neonSpotLight1Helper = new THREE.SpotLightHelper(neonSpotLight1)
// scene.add(neonSpotLight1Helper)

// neon 2
const neonSpotLight2 = new THREE.SpotLight('#0000ff')
scene.add(neonSpotLight2)
neonSpotLight2.position.set(-12, 0.3, 10)
neonSpotLight2.castShadow = true
neonSpotLight2.penumbra = 0.04
neonSpotLight2.angle = 1.6

const targetObject2 = new THREE.Object3D();
scene.add(targetObject2);

targetObject2.position.set(-12, -1, 10)
neonSpotLight2.target = targetObject2;

// const neonSpotLight2Helper = new THREE.SpotLightHelper(neonSpotLight2)
// scene.add(neonSpotLight2Helper)


// sLight helper
const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)


// fog
// scene.fog = new THREE.Fog('#ffffff', 0, 200)
scene.fog = new THREE.FogExp2('#000000', 0.02)


// change background
// renderer.setClearColor('#3333ff')

const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(img03)

const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([img03, img03, img03, img03, img03, img03])


// image as material
const box2Geometry = new THREE.BoxGeometry(10, 10, 10)
const box2Material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(img02)
})
// image at 6 sides
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(bp)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(img01)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(img02)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(img03)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(img04)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(bp)}),

]
// const box2 = new THREE.Mesh(box2Geometry, box2Material)
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial)
scene.add(box2)
box2.position.set(0, 30, 10)


// change the vertex of element
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 3, 3)
const plane2Material = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
scene.add(plane2)
plane2.position.set(50, 10, 10)




// import 3d models
assetLoader.load(m8.href, (gltf) => {
    const model = gltf.scene
    model.scale.set(2,2,2)
    scene.add(model)
    model.position.set(-12, 0, 10)
    model.getObjectByName("VP_Free_BMW_8_vm_T3_024_interior_0").material.color.setHex(0x0000ff)
    console.log(model)
    // clone the model
    const modelClone = SkeletonUtiols.clone(model)
    modelClone.position.set(-5, 0, 10)
    scene.add(modelClone)

    carSpotLight1.target = model
    carSpotLight2.target = modelClone

    // receive shadow
    model.traverse((node) => {
        if(node.isMesh) {
            node.castShadow = true
        }
    })
    modelClone.traverse((node) => {
        if(node.isMesh) {
            node.castShadow = true
        }
    })
}, undefined, (err) => {
    console.log(err)
})



// gui settings
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    sLightAngle: 0.07,
    sLightPenumbra: 0,
    sLightIntensity: 1,
    sLightColor: '#ffffff'
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e
})
gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'sLightAngle', 0, 1)
gui.add(options, 'sLightPenumbra', 0, 1)
gui.add(options, 'sLightIntensity', 0, 1)
gui.addColor(options, 'sLightColor').onChange((e) => {
    spotLight.color.set(e)
})

// randomly change the vertex of plane
plane2.geometry.attributes.position.array[0] = 10 * Math.random()
plane2.geometry.attributes.position.array[1] = 10 * Math.random()
plane2.geometry.attributes.position.array[2] = 10 * Math.random()
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random()
plane2.geometry.attributes.position.needsUpdate = true


// get mouse pos
const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
})

// the ray witch can choose the element
const rayCaster = new THREE.Raycaster()



// set the box name so that we can identify it with mouse
box2.name = 'theBox'
let step = 0




// GLSL & Shaders Tutorial (+ code at the animation block)
// create uniform to provide them to vertex (index.html)
const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            .multiplyScalar(window.devicePixelRatio)},
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
    image: {type: 't', value: new THREE.TextureLoader().load(bp)}
}
window.addEventListener('mousemove', (e) => {
    uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight)
})

const glslPlaneGeometry = new THREE.PlaneGeometry(20, 20, 30, 30)
const glslPlaneMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    wireframe: false,
    side: THREE.DoubleSide,
    uniforms
})
const glslPlane = new THREE.Mesh(glslPlaneGeometry, glslPlaneMaterial)
scene.add(glslPlane)
glslPlane.position.set(30, 10, 10)




const clock = new THREE.Clock()

// this function works continuously
const animate = (time) => {

    // set value to uniform
    uniforms.u_time.value = clock.getElapsedTime()

    step += options.speed
    sphere.position.y = (10 * Math.abs(Math.sin(step))) + 2

    spotLight.angle = options.sLightAngle
    spotLight.penumbra = options.sLightPenumbra
    spotLight.intensity = options.sLightIntensity
    // we need to update helper after changing its options
    sLightHelper.update()

    // choose the elements by mouse
    rayCaster.setFromCamera(mousePosition, camera)
    const intersects = rayCaster.intersectObjects(scene.children)

    // change the property by mouse
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === sphere.id) {
            intersects[i].object.material.color.set('#ffffff')
        }
        if (intersects[i].object.name === 'theBox') {
            box2.rotation.x = time / 1000
            box2.rotation.y = time / 1000
        }
    }


    // rerender
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

// rerender when resize screen width
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// TODO: check out other geometry figures, materials