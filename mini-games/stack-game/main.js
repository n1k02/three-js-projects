import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import animation from "three/addons/renderers/common/Animation.js";

window.focus()

let camera, scene, renderer
let world
let lastTime
let stack
let overhangs
const boxHeight = 1
const originalBoxSize = 3
let autopilot
let gameEnded
let robotPrecision

const scoreElement = document.getElementById('score')
const instructionsElement = document.getElementById('instructions')
const resultsElement = document.getElementById('results')

init()

function setRobotPrecision() {
    robotPrecision = Math.random() * 1 - 0.5
}

function init() {
    autopilot = true
    gameEnded = false
    lastTime = 0
    stack = []
    overhangs = []
    setRobotPrecision()

    world = new CANNON.World()
    world.gravity.set(0, -10, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 40

    const aspect = window.innerWidth / window.innerHeight
    const width = 10
    const height = width / aspect

    camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        0,
        100
    )

    camera.position.set(4, 4, 4)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()

    addLayer(0, 0, originalBoxSize, originalBoxSize)

    addLayer(-10, 0, originalBoxSize, originalBoxSize, 'x')

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dLight.position.set(10, 20, 0)
    scene.add(dLight)

    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(animate)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.append(renderer.domElement)
}

function startGame() {
    autopilot = false
    gameEnded = false
    lastTime = 0
    stack = []
    overhangs = []

    if (instructionsElement) instructionsElement.style.display = 'none'
    if (resultsElement) resultsElement.style.display = 'none'
    if (scoreElement) scoreElement.innerText = 0

    if (world) {
        while (world.bodies.length > 0) {
            world.removeBody(world.bodies[0])
        }
    }
    if (scene) {
        while (scene.children.find((c) => c.type == 'Mesh')) {
            const mesh = scene.children.find((c) => c.type == 'Mesh')
            scene.remove(mesh)
        }

        addLayer(0, 0, originalBoxSize, originalBoxSize)
        addLayer(-10, 0, originalBoxSize, originalBoxSize, 'x')
    }
    if (camera) {
        camera.position.set(4, 4, 4)
        camera.lookAt(0, 0, 0)
    }
}

function addLayer(x, z, width, depth, direction) {
    const y = boxHeight * stack.length
    const layer = generateBox(x, y, z, width, depth, false)
    layer.direction = direction
    stack.push(layer)
}

function addOverHang(x, z, width, depth) {
    const y = boxHeight * (stack.length - 1)
    const overhang = generateBox(x, y, z, width, depth, true)
    overhangs.push(overhang)
}

function generateBox(x, y, z, width, depth, falls) {
    const geometry = new THREE.BoxGeometry(width, boxHeight, depth)
    const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`)
    const material = new THREE.MeshLambertMaterial({color})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    scene.add(mesh)

    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
    )
    let mass = falls ? 5 : 0
    mass *= width / originalBoxSize
    mass *= depth / originalBoxSize
    const body = new CANNON.Body({mass, shape})
    body.position.set(x, y, z)
    world.addBody(body)

    return {
        threejs: mesh,
        cannonjs: body,
        width,
        depth
    }
}

function cutBox(topLayer, overlap, size, delta) {
    const direction = topLayer.direction
    const newWidth = direction === 'x' ? overlap : topLayer.width
    const newDepth = direction === 'z' ? overlap : topLayer.depth

    topLayer.width = newWidth
    topLayer.depth = newDepth

    topLayer.threejs.scale[direction] = overlap / size
    topLayer.threejs.position[direction] -= delta / 2

    topLayer.cannonjs.position[direction] -= delta / 2

    const shape = new CANNON.Box(
        new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
    )
    topLayer.cannonjs.shapes = []
    topLayer.cannonjs.addShape(shape)

}

window.addEventListener('mousedown', eventHandler)
// window.addEventListener('touchstart', eventHandler)
resultsElement.addEventListener('click', (event)=> {
    event.preventDefault()
    startGame()
})
window.addEventListener('keydown', (event) => {
    if (event.key == ' ') {
        event.preventDefault()
        eventHandler()
        return
    }
})

function eventHandler() {
    if (autopilot) startGame()
    else splitBlockAndNextOneIfOverlaps()
}

function splitBlockAndNextOneIfOverlaps() {
    if (gameEnded) return

    const topLayer = stack.at(-1)
    const previousLayer = stack.at(-2)
    const direction = topLayer.direction

    const size = direction === 'x' ? topLayer.width : topLayer.depth
    const delta =
        topLayer.threejs.position[direction] -
        previousLayer.threejs.position[direction]
    const overhangSize = Math.abs(delta)
    const overlap = size - overhangSize
    if (overlap > 0) {
        cutBox(topLayer, overlap, size, delta)

        const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta)
        const overhangX =
            direction === 'x'
                ? topLayer.threejs.position.x + overhangShift
                : topLayer.threejs.position.x
        const overhangZ =
            direction === 'z'
                ? topLayer.threejs.position.z + overhangShift
                : topLayer.threejs.position.z
        const overhangWidth = direction === 'x' ? overhangSize : topLayer.width
        const overhangDepth = direction === 'z' ? overhangSize : topLayer.depth

        addOverHang(overhangX, overhangZ, overhangWidth, overhangDepth)

        const nextX = direction === 'x' ? topLayer.threejs.position.x : -10
        const nextZ = direction === 'z' ? topLayer.threejs.position.z : -10
        const newWidth = topLayer.width
        const newDepth = topLayer.depth
        const nextDirection = direction === 'x' ? 'z' : 'x'

        if (scoreElement) scoreElement.innerText = stack.length - 1
        addLayer(nextX, nextZ, newWidth, newDepth, nextDirection)
    } else {
        missedTheSpot()
    }
}

function missedTheSpot () {
    const topLayer = stack.at(-1)
    addOverHang(
        topLayer.threejs.position.x,
        topLayer.threejs.position.z,
        topLayer.width,
        topLayer.depth
    )
    world.removeBody(topLayer.cannonjs)
    scene.remove(topLayer.threejs)

    gameEnded = true
    if(resultsElement && !autopilot) resultsElement.style.display = 'flex'
}

function animate (time) {
    if(lastTime) {
        const timePassed = time - lastTime
        const speed = 0.008

        const topLayer = stack.at(-1)
        const previousLayer = stack.at(-1)

        if(camera.position.y < boxHeight * (stack.length - 2) + 4) {
            camera.position.y += speed * 10
        }

        const boxShouldMove =
            !gameEnded &&
            (!autopilot ||
                (autopilot &&
                topLayer.threejs.position[topLayer.direction] <
                    previousLayer.threejs.position[topLayer.direction] +
                        robotPrecision))
        if(boxShouldMove) {
            topLayer.threejs.position[topLayer.direction] += speed * timePassed
            topLayer.cannonjs.position[topLayer.direction] += speed * timePassed

            if(topLayer.threejs.position[topLayer.direction] > 10) {
                missedTheSpot()
            }
        } else {
            if(autopilot) {
                splitBlockAndNextOneIfOverlaps()
                setRobotPrecision()
            }
        }

        updatePhysics(timePassed)
        renderer.render(scene, camera)
    }
    lastTime = time
}


function updatePhysics(timePassed) {
    world.step(timePassed / 1000)

    overhangs.forEach((el)=> {
        el.threejs.position.copy(el.cannonjs.position)
        el.threejs.quaternion.copy(el.cannonjs.quaternion)
    })
}

window.addEventListener('resize', ()=> {
    console.log('resize', window.innerWidth, window.innerHeight)
    const aspect = window.innerWidth / window.innerHeight
    const width = 10
    const height = width / aspect

    camera.top = height /2
    camera.bottom = height / -2

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(camera, scene)
})