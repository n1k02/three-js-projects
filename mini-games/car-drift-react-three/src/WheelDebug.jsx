const debug = true

export const WheelDebug = ({ radius, wheelRef, wheelWidth }) => {
  return debug && (
    <group ref={wheelRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius,wheelWidth, 5]} />
        <meshNormalMaterial transparent={true} opacity={0.25} />
      </mesh>
    </group>
  );
};
