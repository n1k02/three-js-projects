import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'cannon-es'
import Debugger from 'cannon-es-debugger'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
// import * as Stats from 'stats'
import {Reflector} from "three/examples/jsm/objects/Reflector";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#ffffff')
document.body.appendChild(renderer.domElement)


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
)







const orbit = new OrbitControls(camera, renderer.domElement)

// camera.position.set(-15, 1, 5)
camera.position.set(4, 0.5, 5)
orbit.update()

// const stats = new Stats()
// stats.showPanel(0)
// document.body.append(stats.dom)


// const axsHelper = new THREE.AxesHelper(8)
// scene.add(axsHelper)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
ambientLight.position.set(10,10,10)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 20, 0);
pointLight.castShadow = true
pointLight.shadow.mapSize.set(2048,2048)
scene.add(pointLight);


/////////////// directional light /////////////////
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
// scene.add(directionalLight)
// directionalLight.position.set(0, 30, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12
//
// /////////////// dr-light helper /////////////////
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)
//
// /////////////// dr-light shadow helper /////////////////
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
scene.fog = new THREE.FogExp2('#ffffff', 0.02)


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.8, 0)
})

const bodyMaterial = new CANNON.Material()
const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 0.8))
const chassisBody = new CANNON.Body({mass: 150, material: bodyMaterial})
chassisBody.addShape(chassisShape)
// car position
// chassisBody.position.set(-30, 4, -2)
chassisBody.position.set(0, 4, 0)
chassisBody.angularVelocity.set(0, 4, 0)
// demo.addVisual(chassisBody)

// Create the vehicle
const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
})

const wheelOptions = {
    radius: 0.35,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 20,
    suspensionRestLength: 0.4,
    frictionSlip: 0.6,
    dampingRelaxation: 3,
    dampingCompression: 3,
    maxSuspensionForce: 1000,
    rollInfluence: 1,
    axleLocal: new CANNON.Vec3(0, 0, 1),
    chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -50,
    useCustomSlidingRotationalSpeed: true,
}

wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, 0.85)
vehicle.addWheel({...wheelOptions})

wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, -0.85)
vehicle.addWheel({...wheelOptions})

wheelOptions.chassisConnectionPointLocal.set(0.95, 0, 0.85)
vehicle.addWheel({...wheelOptions, frictionSlip: 0.45})

wheelOptions.chassisConnectionPointLocal.set(0.95, 0, -0.85)
vehicle.addWheel({...wheelOptions, frictionSlip: 0.45})

vehicle.addToWorld(world)





// let model
let model
let wheelModel
let wheelModels = []
const rx7 = new URL('../assets/rx7_no-wheels.glb', import.meta.url)
const rx7_wheel = new URL('../assets/rx7_wheel.glb', import.meta.url)
const loader = new GLTFLoader();
const dLoader = new DRACOLoader()
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
loader.setDRACOLoader(dLoader)
loader.load(
    rx7.href,
    function (gltf) {
        model = gltf.scene
        model.children[0].rotation.z -= -Math.PI / 2
        model.children[0].position.set(0,-0.5,-3.45)
        scene.add(model)
        model.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                // node.receiveShadow = true;
                node.material.envMapIntensity = 20;
            }
        })
        addTextToModel(model);
    })


    // Lef door 
function addTextToModel(model) {
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const text = "I'm fast";
        const letterSpacing = 0.11; // Расстояние между буквами
        const material = new THREE.MeshStandardMaterial({ color: 0xff5733 });

        let offsetX = -0.96; // Начальная позиция по X
        for (const char of text) {
            const geometry = new TextGeometry(char, {
                font: font,
                size: 0.12,
                height: 0.2,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.01,
                bevelSegments: 12,
            });
        
            const charMesh = new THREE.Mesh(geometry, material);
            charMesh.position.set(offsetX, -0.1, 0.6); // Расположить букву
            model.add(charMesh); // Добавить букву в сцену
            offsetX += letterSpacing;
        }
    });
}

// Rear bumper 
// function addTextToModel(model) {
//     const fontLoader = new FontLoader();
//     fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
//         const text = 'Text';
//         const letterSpacing = 0.11; // Расстояние между буквами
//         // const material = new THREE.MeshStandardMaterial({ color: 0xff5733 });
//         const material = new THREE.MeshStandardMaterial({ color: 0xff1111 });

//         let offsetX = -0.42; // Начальная позиция по X (измените при необходимости)

//         for (const char of text) {
//             const geometry = new TextGeometry(char, {
//                 font: font,
//                 size: 0.12,
//                 height: 0.01, // Толщина текста
//                 bevelEnabled: true,
//                 bevelThickness: 0.01,
//                 bevelSize: 0.005,
//                 bevelSegments: 5,
//             });

//             const charMesh = new THREE.Mesh(geometry, material);

//             // Настройка позиции текста (задний бампер)
//             charMesh.position.set(1.97, -0.2, -offsetX); // Положение на заднем бампере (измените при необходимости)
//             charMesh.rotation.set(0, Math.PI / 2, 0); // Поворот текста, чтобы он был на вертикальной поверхности

//             model.add(charMesh); // Добавить букву к модели
//             offsetX += letterSpacing;
//         }
//     });
// }


loader.load(
    rx7_wheel.href,
    function (gltf) {
        wheelModel = gltf.scene
        wheelModel.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                // node.receiveShadow = true;
                node.material.envMapIntensity = 20;
            }
        })
        let wheelModel1Group = new THREE.Group()
        let wheelModel2Group = new THREE.Group()
        let wheelModel3Group = new THREE.Group()
        let wheelModel4Group = new THREE.Group()

        let wheelModel1 = wheelModel.clone()
        wheelModel1.children[0].rotation.y -= -1.58
        wheelModel1Group.add(wheelModel1)

        let wheelModel2 = wheelModel.clone()
        wheelModel2.children[0].rotation.y += -1.58
        wheelModel2Group.add(wheelModel2)

        let wheelModel3 = wheelModel.clone()
        wheelModel3.children[0].rotation.y -= -1.58
        wheelModel3Group.add(wheelModel3)

        let wheelModel4 = wheelModel.clone()
        wheelModel4.children[0].rotation.y += -1.58
        wheelModel4Group.add(wheelModel4)

        wheelModels.push(wheelModel1Group)
        wheelModels.push(wheelModel2Group)
        wheelModels.push(wheelModel3Group)
        wheelModels.push(wheelModel4Group)

        scene.add(wheelModel1Group)
        scene.add(wheelModel2Group)
        scene.add(wheelModel3Group)
        scene.add(wheelModel4Group)
    })







// Add the wheel bodies
const wheelBodies = []
const wheelMaterial = new CANNON.Material('wheel')
vehicle.wheelInfos.forEach((wheel) => {
    const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 10)
    const wheelBody = new CANNON.Body({
        mass: 1,
        material: wheelMaterial,
    })
    wheelBody.type = CANNON.Body.KINEMATIC
    wheelBody.collisionFilterGroup = 0 // turn off collisions



    const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
    wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
    wheelBodies.push(wheelBody)
    world.addBody(wheelBody)
})


// Add the ground
const groundMaterial = new CANNON.Material({friction: 0})
// const sizeX = 64
// const sizeZ = 64
// const matrix = []
// for (let i = 0; i < sizeX; i++) {
//     matrix.push([])
//     for (let j = 0; j < sizeZ; j++) {
//         if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeZ - 1) {
//             const height = 3
//             matrix[i].push(height)
//             continue
//         }
//
//         const height = Math.cos((i / sizeX) * Math.PI * 5) * Math.cos((j / sizeZ) * Math.PI * 5) * 2 + 2
//         matrix[i].push(height)
//     }
// }
//

// const heightfieldShape = new CANNON.Heightfield(matrix, {
//     elementSize: 100 / sizeX,
// })
// const heightfieldBody = new CANNON.Body({mass: 0, material: groundMaterial})
// heightfieldBody.addShape(heightfieldShape)
// heightfieldBody.position.set(
//     // -((sizeX - 1) * heightfieldShape.elementSize) / 2,
//     -(sizeX * heightfieldShape.elementSize) / 2,
//     -1,
//     // ((sizeZ - 1) * heightfieldShape.elementSize) / 2
//     (sizeZ * heightfieldShape.elementSize) / 2
// )
// heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
// world.addBody(heightfieldBody)



const geometry = new THREE.PlaneGeometry(100, 100);
const groundMirror = new Reflector( geometry, {
    clipBias: 0.03,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio ,
    color: 0xb5b5b5
} );
groundMirror.position.y = -0.001;
groundMirror.rotateX( - Math.PI / 2 );
scene.add( groundMirror );

const reflectiveMaterial  = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.2, // Настройка металличности
    roughness: 0.7, // Настройка шероховатости
    opacity: 0.55,
    transparent: true,
})
//
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );

renderPass.clearColor = new THREE.Color( 255, 255, 255 );
renderPass.clearAlpha = 1.5;

const pixelRatio = renderer.getPixelRatio();
const fxaaPass = new ShaderPass( FXAAShader );
fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth  *pixelRatio );
fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.3, 0.5, 0 );
composer.addPass( renderPass );
composer.addPass( bloomPass );
//
// const composer2 = new EffectComposer( renderer );
//
// // FXAA is engineered to be applied towards the end of engine post processing after conversion to low dynamic range and conversion to the sRGB color space for display.´
//

composer.addPass( fxaaPass );







const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), reflectiveMaterial)
groundMesh.receiveShadow = true
scene.add(groundMesh)
groundMesh.position.set(0,0,0)
groundMesh.rotateX(-Math.PI / 2, 0, 0)

const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({ mass: 0, material:groundMaterial });
groundBody.addShape(groundShape);
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)



// Define interactions between wheels and ground
const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.001,
    restitution: 0,
    contactEquationStiffness: 0,
})
world.addContactMaterial(wheel_ground)
const body_ground = new CANNON.ContactMaterial(bodyMaterial, groundMaterial, {
    friction: 0.001,
    restitution: 0,
    // contactEquationStiffness: 100000000,
})
world.addContactMaterial(body_ground)





// Keybindings
const keysPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
    space: false
};

document.addEventListener('keydown', (event) => {
    const maxSteerVal = 0.78;
    const maxForce = 40000;
    const brakeForce = 10000;

    switch (event.code) {
        case 'KeyW':
            keysPressed.w = true;
            break;
        case 'KeyS':
            keysPressed.s = true;
            break;
        case 'KeyA':
            keysPressed.a = true;
            break;
        case 'KeyD':
            keysPressed.d = true;
            break;
        case 'Space':
            keysPressed.space = true;
            break;
    }

    // Применяем физику в зависимости от состояния клавиш
    if (keysPressed.w) {
        vehicle.applyEngineForce(-maxForce, 2);
        vehicle.applyEngineForce(-maxForce, 3);
    }

    if (keysPressed.s) {
        vehicle.applyEngineForce(maxForce, 2);
        vehicle.applyEngineForce(maxForce, 3);
    }

    if (keysPressed.a) {
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
    }

    if (keysPressed.d) {
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
    }

    if (keysPressed.space) {
        vehicle.setBrake(brakeForce, 2);
        vehicle.setBrake(brakeForce, 3);
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keysPressed.w = false;
            break;
        case 'KeyS':
            keysPressed.s = false;
            break;
        case 'KeyA':
            keysPressed.a = false;
            break;
        case 'KeyD':
            keysPressed.d = false;
            break;
        case 'Space':
            keysPressed.space = false;
            break;
    }

    // Reset forces when key is released
    if (!keysPressed.w && !keysPressed.s) {
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
    }

    if (!keysPressed.a && !keysPressed.d) {
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
    }

    if (!keysPressed.space) {
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);
    }
});





// const cannonDebugger = new Debugger(scene, world)

const timeStep = 1 / 160

const animate = () => {
    // stats.begin();
    world.step(timeStep)
    // cannonDebugger.update()
    // monitored code goes here

    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i)
        const transform = vehicle.wheelInfos[i].worldTransform
        const wheelBody = wheelBodies[i]
        wheelBody.position.copy(transform.position)
        wheelBody.quaternion.copy(transform.quaternion)
        if(wheelModels.length >= 1) {
            wheelModels[i].position.copy(wheelBody.position)
            wheelModels[i].quaternion.copy(wheelBody.quaternion)
        }

    }


    if (model) {
        
    // model.position.set(0,0,0)
        model.position.copy(new THREE.Vector3(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z))
        model.quaternion.copy(chassisBody.quaternion)
    }

   // composer2.render()
   composer.render()

    // renderer.render(scene, camera)
    // stats.end();
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})