'use client';

import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Stars,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingCoin() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} castShadow>
        <torusKnotGeometry args={[1.2, 0.35, 180, 20]} />
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function OrbitingSphere({
  radius,
  speed,
  color,
  size,
  phase,
}: {
  radius: number;
  speed: number;
  color: string;
  size: number;
  phase: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * speed + phase;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = Math.sin(t * 0.7) * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#10b981" />

      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <FloatingCoin />

      <OrbitingSphere
        radius={2.8}
        speed={0.5}
        color="#10b981"
        size={0.22}
        phase={0}
      />
      <OrbitingSphere
        radius={3.4}
        speed={0.35}
        color="#f59e0b"
        size={0.18}
        phase={2}
      />
      <OrbitingSphere
        radius={2.2}
        speed={0.7}
        color="#ec4899"
        size={0.15}
        phase={4}
      />
      <OrbitingSphere
        radius={3.8}
        speed={0.25}
        color="#06b6d4"
        size={0.2}
        phase={1}
      />
    </>
  );
}

export function Hero3D() {
  return (
    <div
      className="absolute inset-0 -z-5 pointer-events-none"
      aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}>
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
