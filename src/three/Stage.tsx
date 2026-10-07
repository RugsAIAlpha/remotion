import {ThreeCanvas} from "@remotion/three";
import React, {useLayoutEffect} from "react";
import * as THREE from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment.js";
import {useThree} from "@react-three/fiber";

/** Studio-style image based lighting without any downloaded HDRI. */
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

/**
 * Transparent 3D stage. Camera looks at (0, camY, 0); at z=1 the frame is ~2.5 world units wide
 * for 1080px. `z` zooms in (used for the small inset windows), `dark` switches to moody
 * cinematic lighting with warm/cool rim lights.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  camY?: number;
  shadowY?: number;
  s?: number;
  w?: number;
  h?: number;
  z?: number;
  dark?: boolean;
}> = ({children, camY = -0.84, shadowY = -0.75, s = 1, w = 1080, h = 1920, z = 1, dark = false}) => {
  const fov = (2 * Math.atan(Math.tan((14 * Math.PI) / 180) / z) * 180) / Math.PI;
  return (
    <ThreeCanvas
      width={w}
      height={h}
      camera={{fov, position: [0, camY, 10], near: 0.1, far: 60}}
      gl={{alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: dark ? 0.78 : 0.82, outputColorSpace: THREE.SRGBColorSpace}}
      shadows="soft"
      style={{position: "absolute", left: 0, top: 0}}
      onCreated={({camera}) => camera.lookAt(0, camY, 0)}
    >
      <Env />
      <ambientLight intensity={dark ? 0.08 : 0.18} />
      <directionalLight position={[3, 6, 5]} intensity={dark ? 2.3 : 1.7} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} shadow-radius={6} />
      <directionalLight position={[-4, 2, 3]} intensity={dark ? 0.25 : 0.5} color="#ffd9b0" />
      {dark ? (
        <>
          <pointLight position={[-3.2, 1.6, -2]} intensity={9} color="#ff8a3d" distance={9} />
          <pointLight position={[3.2, 1.2, 2.5]} intensity={5} color="#6ea8ff" distance={9} />
        </>
      ) : null}
      <group scale={s} position={[0, 0.1 * (1 - s), 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, shadowY, 0]} receiveShadow>
          <planeGeometry args={[9, 9]} />
          <shadowMaterial opacity={dark ? 0.5 : 0.28} />
        </mesh>
        {children}
      </group>
    </ThreeCanvas>
  );
};
