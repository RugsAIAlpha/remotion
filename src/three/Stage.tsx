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
 * Transparent full-frame 3D stage (sits on the cream cutaway paper).
 * Camera looks at the origin; 1 unit ~ 400px at the focal plane.
 */
export const Stage: React.FC<{children: React.ReactNode; camY?: number; shadowY?: number; s?: number}> = ({children, camY = -0.84, shadowY = -0.75, s = 1}) => (
  <ThreeCanvas
    width={1080}
    height={1920}
    camera={{fov: 28, position: [0, camY, 10], near: 0.1, far: 60}}
    gl={{alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.82, outputColorSpace: THREE.SRGBColorSpace}}
    shadows="soft"
    style={{position: "absolute", inset: 0}}
    onCreated={({camera}) => camera.lookAt(0, camY, 0)}
  >
    <Env />
    <ambientLight intensity={0.18} />
    <directionalLight position={[3, 6, 5]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} shadow-radius={6} />
    <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#ffd9b0" />
    <group scale={s} position={[0, 0.1 * (1 - s), 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, shadowY, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
      {children}
    </group>
  </ThreeCanvas>
);
