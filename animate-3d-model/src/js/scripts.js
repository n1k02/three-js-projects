import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const rx7 = new URL('../assets/rx7.glb', import.meta.url)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#a3a3a3')
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

const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)
ambientLight.position.set(-10, 20, 0)
scene.add(ambientLight)

let mixer;
const assetLoader = new GLTFLoader()
assetLoader.load(rx7.href, (gltf) => {
    const model = gltf.scene
    console.log(model)

    model.position.set(0, 0.3, 0)
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadlightsUp')
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach(clip => {
        const action = mixer.clipAction(clip)
        action.play()
    })
}, undefined, (err) => {
    console.log(err)
})


const clock = new THREE.Clock()

const animate = () => {
    if (mixer) {
        mixer.update(clock.getDelta())
    }
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})