import * as CANNON from 'cannon-es'
import * as THREE from 'three'


const bodyMaterial = new CANNON.Material()
const chassisShape = new CANNON.Box(new CANNON.Vec3(2.2, 0.5, 0.8))
const chassisBody = new CANNON.Body({mass: 150, material: bodyMaterial})
chassisBody.inertia.set(50, 50, 10); // Более высокая инерция по осям X и Y
chassisBody.addShape(chassisShape)
chassisBody.position.set(0, 3, 0)
// chassisBody.angularVelocity.set(8, 0, 0)
// demo.addVisual(chassisBody)

// Create the vehicle

// const chassisMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.Material());
// geometry и material - ваши геометрия и материал машинки

// Присвоение объекта к переменной chassisBody.current
// chassisBody.current = chassisMesh;
const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
})

export {vehicle, chassisBody}