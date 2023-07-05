import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

const sceneInit = () => {
    const renderer = new THREE.WebGLRenderer()
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.setClearColor('#ffffff')
    document.body.appendChild(renderer.domElement)


    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    )


    const orbit = new OrbitControls(camera, renderer.domElement)

    camera.position.set(10, 10, 10)
    orbit.update()


    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2
    const hdrTextureURL = new URL('../assets/envmap.hdr', import.meta.url)
    const loader = new RGBELoader()
    loader.load(hdrTextureURL.href, (texture)=> {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })

        return {renderer, scene, camera, orbit}
}




export default sceneInit