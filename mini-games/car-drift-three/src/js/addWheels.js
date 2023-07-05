import * as CANNON from "cannon-es";


const addWheels = (vehicle) => {
    const wheelOptions = {
        radius: 0.35,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 70,
        suspensionRestLength: 0.4,
        frictionSlip: 0.85,
        // frictionSlip: 1,
        dampingRelaxation: 4,
        dampingCompression: 4,
        maxSuspensionForce:700,
        rollInfluence: 0.3,
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
        maxSuspensionTravel: 0.2,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
    }

// wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, 0.85)
    wheelOptions.chassisConnectionPointLocal.set(-1.5, 0, 0.85)
    vehicle.addWheel({...wheelOptions})

// wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, -0.85)
    wheelOptions.chassisConnectionPointLocal.set(-1.5, 0, -0.85)
    vehicle.addWheel({...wheelOptions})

// wheelOptions.chassisConnectionPointLocal.set(0.95, 0, 0.85)
    wheelOptions.chassisConnectionPointLocal.set(1.3, 0, 0.85)
    // vehicle.addWheel({...wheelOptions, frictionSlip: 0.7})
    vehicle.addWheel({...wheelOptions, frictionSlip: 0.6})

// wheelOptions.chassisConnectionPointLocal.set(0.95, 0, -0.85)
    wheelOptions.chassisConnectionPointLocal.set(1.3, 0, -0.85)
    // vehicle.addWheel({...wheelOptions, frictionSlip: 0.7})
    vehicle.addWheel({...wheelOptions, frictionSlip: 0.6})


}

export default addWheels