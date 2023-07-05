import { useEffect, useState } from "react";

export const useControls = (vehicleApi, chassisApi) => {
  let [controls, setControls] = useState({ });
  let [engineForce, setEngineForce] = useState(30000)
  let [steeringValue, setSteeringValue] = useState(0.85)
  useEffect(() => {
    const keyDownPressHandler = (e) => {
      setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: true }));
    }

    const keyUpPressHandler = (e) => {
      setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: false }));
    }
  
    window.addEventListener("keydown", keyDownPressHandler);
    window.addEventListener("keyup", keyUpPressHandler);
    return () => {
      window.removeEventListener("keydown", keyDownPressHandler);
      window.removeEventListener("keyup", keyUpPressHandler);
    }
  }, []);

  useEffect(() => {
    if(!vehicleApi || !chassisApi) return;

    if (controls.w) {
      vehicleApi.applyEngineForce(engineForce, 0);
      vehicleApi.applyEngineForce(engineForce, 1);
    } else if (controls.s) {
      vehicleApi.applyEngineForce(-engineForce, 0);
      vehicleApi.applyEngineForce(-engineForce, 1);
    } else {
      vehicleApi.applyEngineForce(0, 0);
      vehicleApi.applyEngineForce(0, 1);
    }

    if (controls.a) {
      vehicleApi.setSteeringValue(steeringValue, 2);
      vehicleApi.setSteeringValue(steeringValue, 3);
      // vehicleApi.setSteeringValue(-0.1, 0);
      // vehicleApi.setSteeringValue(-0.1, 1);
    } else if (controls.d) {
      vehicleApi.setSteeringValue(-steeringValue, 2);
      vehicleApi.setSteeringValue(-steeringValue, 3);
      // vehicleApi.setSteeringValue(0.1, 0);
      // vehicleApi.setSteeringValue(0.1, 1);
    } else {
      for(let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    if (controls.arrowdown)  chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
    if (controls.arrowup)    chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
    if (controls.arrowleft)  chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
    if (controls.arrowright) chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);

    if (controls.r) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  }, [controls, vehicleApi, chassisApi]);

  return controls;
}