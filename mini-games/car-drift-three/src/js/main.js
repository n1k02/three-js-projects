import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {Reflector} from "three/examples/jsm/objects/Reflector";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js';
import loadModels from './loader'
import Stats from 'stats.js'
import CannonDebugger from 'cannon-es-debugger'


// initialization scene
import sceneInit from "./sceneInit";

const {renderer, scene, camera, orbit} = sceneInit()



// fps stats
const stats = new Stats()
stats.showPanel(0)
document.body.append(stats.dom)

//axs
// const axsHelper = new THREE.AxesHelper(8)
// scene.add(axsHelper)

// lights
import addLights from "./lights";

addLights(scene)


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.8, 0)
})

import {vehicle, chassisBody} from "./vehicle";
import addWheels from "./addWheels";

vehicle.addToWorld(world)
addWheels(vehicle)


//  load models
let model
let wheels = []


loadModels().then((res) => {
    model = res.model
    wheels = res.wheelModels
    const track = res.track

    const ramp = res.ramp
    const rampGeometry = ramp.children[0].geometry;
    rampGeometry.scale(15,15,15)
    const vertices = rampGeometry.attributes.position.array;
    const indices  = rampGeometry.index.array;
    const rampShape = new CANNON.Trimesh(vertices, indices)


    // rampShape.scale.set(3.47,3.47,3.47)
    const rampBody = new CANNON.Body({mass: 0, material: groundMaterial});
    rampBody.addShape(rampShape);
    world.addBody(rampBody);
    rampBody.position.set(0,0,0)

    scene.add(track)
    scene.add(model)
    wheels.forEach(wheel => {
        scene.add(wheel)
    })
})


// Add the wheel bodies
const wheelBodies = []
const wheelMaterial = new CANNON.Material('wheel')
vehicle.wheelInfos.forEach((wheel) => {
    const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius, 30)
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
const groundMaterial = new CANNON.Material({friction: 1})

const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({mass: 0, material: groundMaterial});
groundBody.addShape(groundShape);
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const geometry = new THREE.PlaneGeometry(200, 200);
const groundMirror = new Reflector(geometry, {
    clipBias: 0.03,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x000000
});
groundMirror.position.y = -0.01;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5, // Настройка металличности
    roughness: 0, // Настройка шероховатости
    opacity: 0.5,
    transparent: true,
})


// Создание шейдерных проходов для постобработки
const renderPass = new RenderPass(scene, camera);
const fxaaPass = new ShaderPass(FXAAShader);
const colorCorrectionPass =new ShaderPass(ColorCorrectionShader);

// Создание bloom pass
const bloomPass = new UnrealBloomPass(
    0.3, // сила эффекта bloom (значение от 0 до 1)
    0.4, // радиус эффекта bloom (значение от 0 до 1)
    0.4, // пороговое значение для эффекта bloom (значение от 0 до 1)
);

// Создание composer2 для постобработки с эффектом размытия (FXAA)
const composer2 = new EffectComposer(renderer);
composer2.addPass(renderPass);
composer2.addPass(colorCorrectionPass);
composer2.addPass(bloomPass)
composer2.addPass(fxaaPass);

// Настройка параметров FXAA
const container = document.getElementById('container');
const pixelRatio = renderer.getPixelRatio();
const resolutionX = 1 / (container.offsetWidth * pixelRatio);
const resolutionY = 1 / (container.offsetHeight * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.set(resolutionX, resolutionY);

    const blur = 1; // Измените этот параметр, чтобы изменить степень размытия

    // Установка параметров размытия
    fxaaPass.material.uniforms['resolution'].value.set(resolutionX * blur, resolutionY * blur);




const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 1, 1), reflectiveMaterial)
groundMesh.receiveShadow = true
scene.add(groundMesh)
groundMesh.position.set(0, 0, 0)
groundMesh.rotateX(-Math.PI / 2, 0, 0)


// Define interactions between wheels and ground
const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0,
    restitution: 0,
    contactEquationStiffness: 0,
})
world.addContactMaterial(wheel_ground)
const body_ground = new CANNON.ContactMaterial(vehicle.chassisBody.material, groundMaterial, {
    friction: 0.001,
    restitution: 0,
    contactEquationStiffness: 100000000,
})
world.addContactMaterial(body_ground)


// Keybindings
// Add force on keydown
let cameraMode = 3
document.addEventListener('keydown', (event) => {
    const maxSteerVal = 0.82
    const maxForce = 30000
    const brakeForce = 1000000

    switch (event.key) {
        case 'w':
            vehicle.applyEngineForce(-maxForce, 2)
            vehicle.applyEngineForce(-maxForce, 3)
            break

        case 's':
            vehicle.applyEngineForce(maxForce, 2)
            vehicle.applyEngineForce(maxForce, 3)
            break

        case 'a':
            vehicle.setSteeringValue(maxSteerVal, 0)
            vehicle.setSteeringValue(maxSteerVal, 1)
            break

        case 'd':
            vehicle.setSteeringValue(-maxSteerVal, 0)
            vehicle.setSteeringValue(-maxSteerVal, 1)
            break

        case ' ':
            // vehicle.setBrake(brakeForce, 0)
            // vehicle.setBrake(brakeForce, 1)
            vehicle.setBrake(brakeForce, 2)
            vehicle.setBrake(brakeForce, 3)
            break
        case 'r' || 'к':
            chassisBody.position.set(0, 5, 0)
            chassisBody.velocity.set(0,0,0)
            chassisBody.angularVelocity.set(0,0,0)
            break


        case 'ArrowDown':
            chassisBody.applyImpulse( new CANNON.Vec3(0, -5, 0), new CANNON.Vec3(+20, 0, 0))
            break
        case 'ArrowUp':
            chassisBody.applyImpulse( new CANNON.Vec3(0, -5, 0), new CANNON.Vec3(-20, 0, 0))
            break
        case 'ArrowLeft':
            chassisBody.applyImpulse( new CANNON.Vec3(0, -5, 0), new CANNON.Vec3(0, 0, +10))
            break
        case 'ArrowRight':
            chassisBody.applyImpulse( new CANNON.Vec3(0, -5, 0), new CANNON.Vec3(0, 0, -10))
            break

        case 'c' || 'с':
            if(cameraMode === 1) {
                cameraMode = 2
                break
            }
            if(cameraMode === 2) {
                cameraMode = 3
                break
            }
            if(cameraMode === 3) {
                cameraMode = 1
                break
            }
    }
})

// Reset force on keyup
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            vehicle.applyEngineForce(0, 2)
            vehicle.applyEngineForce(0, 3)
            break

        case 's':
            vehicle.applyEngineForce(0, 2)
            vehicle.applyEngineForce(0, 3)
            break

        case 'a':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break

        case 'd':
            vehicle.setSteeringValue(0, 0)
            vehicle.setSteeringValue(0, 1)
            break

        case ' ':
            // vehicle.setBrake(0, 0)
            // vehicle.setBrake(0, 1)
            vehicle.setBrake(0, 2)
            vehicle.setBrake(0, 3)
            break
    }
})


let isDebug = 0
const cannonDebugger = new CannonDebugger(scene, world)


let cameraDistance = 20; // Расстояние между камерой и машиной
let cameraAngleY = 0; // Угол вращения камеры вокруг машины
let cameraAngleZ = 0; // Угол вращения камеры вокруг машины
let flag = 0
function handleMouseMove(event) {
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    cameraAngleY -= movementX * 0.01; // Коэффициент для определения скорости вращения камеры
    cameraAngleZ += movementY * 0.01; // Коэффициент для определения скорости вращения камеры

}

// Добавление обработчика события движения мыши
document.addEventListener('mousedown', ()=> {
    document.addEventListener('mousemove', handleMouseMove, false);
})
document.addEventListener('mouseup', ()=> {
    document.removeEventListener('mousemove', handleMouseMove)
})

document.addEventListener('wheel', (e)=> {
    if(e.deltaY>0) {
        cameraDistance +=1
    } else {
        cameraDistance -=1
    }
})

const mirror = document.getElementById('isMirror')
const postProcecssing = document.getElementById('isPostProcessing')
mirror.addEventListener('change', (e)=> {
    if(mirror.checked) {
        scene.add(groundMirror)
    } else {
        scene.remove(groundMirror)
    }
})
postProcecssing.addEventListener('change', (e)=> {
    if(postProcecssing.checked) {
        composer2.addPass(bloomPass)
        composer2.addPass(fxaaPass)
    } else {
        composer2.removePass(bloomPass)
        composer2.removePass(fxaaPass)
    }
})


const timeStep = 1 / 60

const animate = () => {
    stats.begin();

    world.step(timeStep)
    if (isDebug) cannonDebugger.update()

       for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i)
        const transform = vehicle.wheelInfos[i].worldTransform
        const wheelBody = wheelBodies[i]
        wheelBody.position.copy(transform.position)
        wheelBody.quaternion.copy(transform.quaternion)
        if (wheels.length >= 1) {
            wheels[i].position.copy(wheelBody.position)
            wheels[i].quaternion.copy(wheelBody.quaternion)
        }

    }
    if (model) {
        model.position.copy(vehicle.chassisBody.position)
        model.quaternion.copy(vehicle.chassisBody.quaternion)

        if(cameraMode >= 2) {
            const cameraGroup = new THREE.Group()
            cameraGroup.add(camera)
            model.add(cameraGroup);

            if(cameraMode === 2) {
                camera.position.set(cameraDistance, 5, 0); // Устанавливаем позицию камеры относительно модели
                camera.lookAt(model.position); // Направляем камеру на модель

                cameraGroup.rotateY(cameraAngleY)
                cameraGroup.rotateZ(cameraAngleZ)
            }
            if(cameraMode === 3) {
                camera.position.set(-4, 3, 0);
                camera.rotation.y = 1.55
                camera.rotation.z = 0
                camera.rotation.x = 0
                // camera.lookAt(camera.position.x + cameraGroup.position.x * 2, 2, camera.position.z - cameraGroup.position.z)
            }

        } else {
           scene.add(camera)

        }
    }

    composer2.render();

    // renderer.render(scene, camera)
    stats.end();
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)


    renderer.setSize( container.offsetWidth, container.offsetHeight );
    composer1.setSize( container.offsetWidth, container.offsetHeight );
    composer2.setSize( container.offsetWidth, container.offsetHeight );

    const pixelRatio = renderer.getPixelRatio();

    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
})