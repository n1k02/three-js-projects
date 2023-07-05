import * as CANNON from "cannon-es";


const addWheels = (vehicle) => {
    const wheelOptions = {
        radius: 0.35,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 100,
        suspensionRestLength: 0.4,
        frictionSlip: 0.85,
        // frictionSlip: 1,
        dampingRelaxation: 2,
        dampingCompression: 2,
        maxSuspensionForce:1000,
        rollInfluence: 0.3,
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
        maxSuspensionTravel: 0.1,
        customSlidingRotationalSpeed: -10,
        useCustomSlidingRotationalSpeed: false,
    }

// wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, 0.85)
    wheelOptions.chassisConnectionPointLocal.set(-1.5, 0, 0.7)
    vehicle.addWheel({...wheelOptions})

// wheelOptions.chassisConnectionPointLocal.set(-1.6, 0, -0.85)
    wheelOptions.chassisConnectionPointLocal.set(-1.5, 0, -0.7)
    vehicle.addWheel({...wheelOptions})

// wheelOptions.chassisConnectionPointLocal.set(0.95, 0, 0.85)
    wheelOptions.chassisConnectionPointLocal.set(1.3, 0, 0.7)
    // vehicle.addWheel({...wheelOptions, frictionSlip: 0.7})
    vehicle.addWheel({...wheelOptions, frictionSlip: 0.65})

// wheelOptions.chassisConnectionPointLocal.set(0.95, 0, -0.85)
    wheelOptions.chassisConnectionPointLocal.set(1.3, 0, -0.7)
    // vehicle.addWheel({...wheelOptions, frictionSlip: 0.7})
    vehicle.addWheel({...wheelOptions, frictionSlip: 0.65})


}

export default addWheels