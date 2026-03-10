import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function CoffeeCup() {
  const steamRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (steamRef.current) {
      steamRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        mesh.position.y = ((state.clock.getElapsedTime() * 0.5 + i * 0.5) % 2);
        mesh.scale.setScalar(1 - mesh.position.y * 0.5);
        material.opacity = (1 - mesh.position.y * 0.5) * 0.5;
      });
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
      <group position={[0, -0.8, 0]}>
        {/* Saucer */}
        <mesh position={[0, -0.65, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1, 0.1, 32]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.1} metalness={0.05} />
        </mesh>
        
        {/* Cup Body - More elegant tapered shape */}
        <mesh castShadow>
          <latheGeometry args={[
            [
              new THREE.Vector2(0.6, -0.6),
              new THREE.Vector2(0.8, -0.4),
              new THREE.Vector2(0.9, 0),
              new THREE.Vector2(0.95, 0.4),
              new THREE.Vector2(1, 0.6)
            ].map(v => new THREE.Vector2(v.x * 0.8, v.y)),
            32
          ]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.1} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* Cup Handle - More refined torus */}
        <mesh position={[0.7, 0.1, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <torusGeometry args={[0.35, 0.07, 16, 32, Math.PI * 1.2]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.1} metalness={0.05} />
        </mesh>

        {/* Coffee Surface */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.05, 32]} />
          <meshStandardMaterial color="#2C1B12" roughness={0.2} />
        </mesh>

        {/* Steam Effect */}
        <group ref={steamRef} position={[0, 0.6, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[Math.sin(i) * 0.2, 0, Math.cos(i) * 0.2]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

function CoffeeBean({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() + position[0]) * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} castShadow>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#3C2A21" roughness={0.5} />
    </mesh>
  );
}

function Leaf({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.2;
      meshRef.current.position.y += Math.cos(state.clock.getElapsedTime() * 0.5 + position[1]) * 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.3, 0.5]} />
      <meshStandardMaterial color="#8A9A5B" side={THREE.DoubleSide} transparent opacity={0.8} />
    </mesh>
  );
}

function Scene() {
  const beans = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 2
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5
    }));
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 3
      ] as [number, number, number],
      rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
      scale: 1 + Math.random() * 1.5
    }));
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      
      <CoffeeCup />
      
      {beans.map((props, i) => (
        <CoffeeBean key={`bean-${i}`} {...props} />
      ))}
      
      {leaves.map((props, i) => (
        <Leaf key={`leaf-${i}`} {...props} />
      ))}

      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
    </>
  );
}

export default function ThreeCanvas() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas shadows dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
