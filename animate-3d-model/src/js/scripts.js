import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import gsap from 'gsap'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";

const rx7 = new URL('../assets/rx7.glb', import.meta.url)
const girl = new URL('../assets/girl.glb', import.meta.url)


const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setClearColor('#000000')
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

camera.position.set(7, 5, 1)
orbit.update()



// post processing
const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4,
    0.1,
    0.1
)
composer.addPass(bloomPass)

renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 1.5


const grid = new THREE.GridHelper(30, 30)
scene.add(grid)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
ambientLight.position.set(-10, 20, 0)
scene.add(ambientLight)
const directLight = new THREE.DirectionalLight('#ffffff', 1)
directLight.position.set(0, 10, 0)
directLight.castShadow = true
directLight.shadow.mapSize.x = 2048; // default
directLight.shadow.mapSize.y = 2048; // default
directLight.shadow.camera.top = 20
directLight.shadow.camera.right = 20
directLight.shadow.camera.bottom = -20
directLight.shadow.camera.left = -20
scene.add(directLight)


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        color: '#ffffff'
    })
)
plane.rotateX(-Math.PI * 0.5)
plane.receiveShadow = true
scene.add(plane)

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(2048, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
});
// Create cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);

scene.add(cubeCamera);


// const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0x777777,
//     roughness: 0,
//     metalness: 1,
//     envMap: cubeRenderTarget.texture,
// })
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// scene.add(sphere)
// sphere.position.set(0, 0.1, 0)
// sphere.castShadow = true


// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 1


const modelObj = new THREE.Object3D()
scene.add(modelObj)

let mixer1;
let model;
const assetLoader = new GLTFLoader()
assetLoader.load(rx7.href, (gltf) => {
    model = gltf.scene
    console.log(model)

    model.position.set(4, 0.3, 0)
    model.rotateY(-0.8)
    modelObj.add(model)
    model.traverse(node => {
        if (node.isMesh) {
            node.castShadow = true
        }
    })


    mixer1 = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    // const clip1 = THREE.AnimationClip.findByName(clips, 'HeadlightsUp')
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach(clip => {
        if (clip.name === 'LWheelAction' || clip.name === 'RWheelAcrion') return
        const action = mixer1.clipAction(clip)
        action.play()
        if (clip.name !== 'HeadlightsUp') {
            action.setEffectiveTimeScale(10)
        }
    })
}, undefined, (err) => {
    console.log(err)
})

let mixer2;
assetLoader.load(girl.href, (gltf) => {
    let model2 = gltf.scene
    console.log(model2)
    model2.scale.set(0.2,0.2,0.2)
    // model.position.set(4, 0.3, 0)
    // model.rotateY(-0.8)
    scene.add(model2)
    model2.traverse(node => {
        if (node.isMesh) {
            node.castShadow = true
        }
    })

    mixer2 = new THREE.AnimationMixer(model2)
    const clips = gltf.animations
    // const clip1 = THREE.AnimationClip.findByName(clips, 'HeadlightsUp')
    // const action = mixer.clipAction(clip)
    // action.play()
    clips.forEach(clip => {
        const action = mixer2.clipAction(clip)
        action.play()
        action.setEffectiveTimeScale(1)
    })

})

// gsap camera animation
window.addEventListener('mousedown', cameraAnimation)
let target= new THREE.Vector3()
const tl = gsap.timeline()
const ease = 'ease'
function cameraAnimation() {

        animationIsFinished = true

        // tl.to(camera.position, {
        //     x: -4,
        //     y: 0.5,
        //     z: 2,
        //     duration: 2,
        //     ease,
        //     onUpdate: () => {
        //         let target = new THREE.Vector3()
        //         model.getWorldPosition(target)
        //         camera.lookAt(target)
        //     }
        // })
        //     .to(camera.position, {
        //         x: 0,
        //         y: 1,
        //         z: -5,
        //         duration: 3,
        //         ease,
        //         onUpdate: () => {
        //             model.getWorldPosition(target)
        //             camera.lookAt(target)
        //         }
        //     })
        //     .to({}, {
        //         duration: 3,
        //         onUpdate: () => {
        //             model.getWorldPosition(target)
        //             camera.lookAt(target)
        //         }
        //     })
        //     .to(camera.position, {
        //         x: 7,
        //         y: 5,
        //         z: 1,
        //         duration: 4,
        //         ease,
        //         onUpdate: () => {
        //             model.getWorldPosition(target)
        //             camera.lookAt(target)
        //         }
        //     })
        //     .to(target, {
        //         x: 0,
        //         y: 0,
        //         z: 0,
        //         duration: 2,
        //         ease,
        //         onUpdate: () => {
        //             camera.lookAt(target)
        //         }
        //     })


}

const clock1 = new THREE.Clock()
const clock2 = new THREE.Clock()

const animate = () => {

    if (mixer1) {
        mixer1.update(clock1.getDelta())

    }
    if (mixer2) {
        mixer2.update(clock2.getDelta())
    }

    modelObj.rotateY(-0.01)


    // sphere.visible = false;
    // cubeCamera.position.copy(sphere.position);
    // cubeCamera.update(renderer, scene);
    // sphere.visible = true;

    //renderer.render(scene, camera)
    composer.render()
    requestAnimationFrame(animate)
}

// renderer.setAnimationLoop(animate)
animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

console.log(cubeRenderTarget)