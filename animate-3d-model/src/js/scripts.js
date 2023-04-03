import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const rx7 = new URL('../assets/rx7.glb', import.meta.url)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#000000')
renderer.setPixelRatio(window.devicePixelRatio)
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

const grid = new THREE.GridHelper(30, 30)
scene.add(grid)

// const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
// ambientLight.position.set(-10, 20, 0)
// scene.add(ambientLight)
const directLight = new  THREE.DirectionalLight('#ffffff', 1)
directLight.position.set(0,10,0)
directLight.castShadow = true
directLight.shadow.mapSize.x = 2048; // default
directLight.shadow.mapSize.y = 2048; // default
directLight.shadow.camera.top = 20
directLight.shadow.camera.right = 20
directLight.shadow.camera.bottom = -20
directLight.shadow.camera.left = -20
scene.add(directLight)


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30),
    new THREE.MeshStandardMaterial({
        color: '#ffffff'
    })
)
plane.rotateX(-Math.PI * 0.5)
plane.receiveShadow = true
scene.add(plane)

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 2048, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
} );
// Create cube camera
const cubeCamera = new THREE.CubeCamera( 0.1, 1000, cubeRenderTarget );

scene.add( cubeCamera );


const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0,
    metalness: 1,
    envMap: cubeRenderTarget.texture,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(0, 0.1, 0)
sphere.castShadow = true



renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

const modelObj = new THREE.Object3D()
scene.add(modelObj)

let mixer;
let model;
const assetLoader = new GLTFLoader()
assetLoader.load(rx7.href, (gltf) => {
    model = gltf.scene
    console.log(model)

    model.position.set(4, 0.3, 0)
    model.rotateY(-0.8)
    modelObj.add(model)
    model.traverse(node => {
        if(node.isMesh) {
            node.castShadow = true
        }
    })


    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    // const clip1 = THREE.AnimationClip.findByName(clips, 'HeadlightsUp')
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach(clip => {
        if(clip.name === 'LWheelAction' || clip.name === 'RWheelAcrion') return
        const action = mixer.clipAction(clip)
        action.play()
        if(clip.name !== 'HeadlightsUp') {
        action.setEffectiveTimeScale(10)
        }
    })
}, undefined, (err) => {
    console.log(err)
})




const clock = new THREE.Clock()

const animate = () => {
    if (mixer) {
        mixer.update(clock.getDelta() )
    }

    modelObj.rotateY(-0.01)


    sphere.visible = false;
    cubeCamera.position.copy( sphere.position );

    cubeCamera.update( renderer, scene );

// Render the scene
    sphere.visible = true;

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

console.log(cubeRenderTarget)