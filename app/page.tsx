"use client";
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- VIP Part 1: Particle Transition System ---
function FloatingStars({ setSceneStage }: { setSceneStage: (stage: number) => void }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  const count = 4500; // Particle density barha di taake bare heart me gaps na dikhein

  // Define Spawn (offscreen) and Destination (Heart) Positions
  const [targetPositions, finalPositions] = useMemo(() => {
    const start = new Float32Array(count * 3);
    const end = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Stars fly in from deep space tunnel
      const startAngle = Math.random() * Math.PI * 2;
      const startRadius = 40 + Math.random() * 20;
      start[i * 3] = startRadius * Math.sin(startAngle);
      start[i * 3 + 1] = startRadius * Math.cos(startAngle);
      start[i * 3 + 2] = -50 - Math.random() * 30;

      // 3D Parametric Heart Formula Destination
      const t = Math.PI * 2 * (i / count);
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.random() - 0.5) * 7 * Math.sin(t); // Deep 3D core

      // OUTCLASS UPGRADE: Scale multiplier 0.23 se barha kr 0.38 krdiya taake heart BARA bny
      end[i * 3] = x * 0.38;
      end[i * 3 + 1] = y * 0.38;
      end[i * 3 + 2] = z * 0.38;
    }
    return [start, end];
  }, [count]);

  const currentPositions = useMemo(() => new Float32Array(targetPositions), [targetPositions]);

  // Hook direct insertion to avoid JSX primitive Red-lines permanently
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(currentPositions, 3)
      );
    }
  }, [currentPositions]);

  // Sequence Timers
  useEffect(() => {
    const timer1 = setTimeout(() => setSceneStage(1), 3500); // Heart Formed
    const timer2 = setTimeout(() => setSceneStage(2), 4600); // Text Reveals perfectly inside
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setSceneStage]);

  useFrame((state) => {
    if (!pointsRef.current || !pointsRef.current.geometry) return;

    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttribute = geo.attributes.position as THREE.BufferAttribute;

    if (!posAttribute) return;

    // Smooth LERP animation from offscreen to heart
    for (let i = 0; i < count; i++) {
      const travelDuration = 3.2;
      const speedOffset = (i / count) * 0.6;
      const tTravel = Math.min(1, Math.max(0, (time - speedOffset) / travelDuration));

      const easeTravel = 1 - Math.pow(1 - tTravel, 3); // Cubic Ease Out

      currentPositions[i * 3] = THREE.MathUtils.lerp(targetPositions[i * 3], finalPositions[i * 3], easeTravel);
      currentPositions[i * 3 + 1] = THREE.MathUtils.lerp(targetPositions[i * 3 + 1], finalPositions[i * 3 + 1], easeTravel);
      currentPositions[i * 3 + 2] = THREE.MathUtils.lerp(targetPositions[i * 3 + 2], finalPositions[i * 3 + 2], easeTravel);
    }

    posAttribute.copyArray(currentPositions);
    posAttribute.needsUpdate = true;

    // Rotation & Pulse sequences
    if (time > 2.5) {
      const settleTime = time - 2.5;
      pointsRef.current.rotation.y = settleTime * 0.45;
      pointsRef.current.rotation.x = Math.sin(settleTime * 0.2) * 0.12;

      // Premium breathing/pulsing animation loop
      const pulse = 1 + Math.sin(settleTime * 2.2) * 0.03;
      pointsRef.current.scale.set(pulse, pulse, pulse);
    } else {
      pointsRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        transparent
        color="#ff2a85"
        size={0.15} // Slightly balanced size for high-density big heart
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// --- Main Page Component ---
export default function PremiumVipHeart() {
  const [sceneStage, setSceneStage] = useState<number>(0);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center font-sans select-none">

      {/* Glow Ambient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,133,0.12)_0%,transparent_75%)] pointer-events-none" />

      {/* Three.js Canvas Layer */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 16], fov: 60 }}
          dpr={[1, 2]}
          gl={{ toneMapping: THREE.NoToneMapping }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <FloatingStars setSceneStage={setSceneStage} />
        </Canvas>
      </div>

      {/* Typography Overlay (Centered Perfectly Inside the Heart) */}
      {/* absolute flex items-center justify-center layout lagaya hai taake overlay absolute center ho */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {sceneStage === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 transform -y-2" // Halka sa offset upar kiya hai heart ke center coordinate match krne k liye
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white drop-shadow-[0_0_50px_rgba(255,42,133,0.75)]">
              I Love You Mahi
            </h1>
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 0.8, letterSpacing: "0.5em" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xs md:text-sm text-pink-300/80 uppercase font-medium"
            >
              Created For You
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Tech Borders */}
      <div className="absolute inset-6 border border-white/5 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-pink-500/30" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-pink-500/30" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-pink-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-pink-500/30" />
      </div>
    </div>
  );
}