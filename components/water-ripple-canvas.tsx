'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getColorDeep,
  getColorHighlight,
  getWaveSpeed,
  getWaveIntensity,
  updateAndGetAudioLevel,
} from '@/lib/water-state';

// ─────────────────────────────────────────────
// Vertex Shader — dynamic waves + audio reactivity
// ─────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uClickPos;
  uniform float uIntensity;
  uniform float uAudioLevel;
  uniform float uWaveSpeed;
  uniform float uWaveIntensity;

  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float speed = uWaveSpeed;
    float amp = uWaveIntensity;
    float audioBoost = 1.0 + uAudioLevel * 5.0;

    // ── Ambient waves ──
    float ambient = 0.0;
    ambient += sin(pos.x * 2.5 + uTime * 0.4 * speed) * 0.025;
    ambient += sin(pos.y * 3.2 + uTime * 0.3 * speed) * 0.020;
    ambient += sin((pos.x + pos.y) * 1.8 + uTime * 0.5 * speed) * 0.015;
    ambient += sin((pos.x * 1.5 - pos.y * 2.3) * 1.2 + uTime * 0.25 * speed) * 0.010;
    pos.z += ambient * amp * audioBoost;

    // ── Audio-driven extra ripples ──
    if (uAudioLevel > 0.01) {
      float audioWave1 = sin(pos.x * 6.0 + uTime * 3.5) * sin(pos.y * 5.0 + uTime * 2.8);
      float audioWave2 = sin(pos.x * 3.5 - pos.y * 4.5 + uTime * 2.0);
      pos.z += (audioWave1 * 0.04 + audioWave2 * 0.02) * uAudioLevel * amp;
    }

    // ── Mouse-following ripple ──
    float distMouse = distance(uv, uMouse);
    float mouseWave = sin(distMouse * 30.0 - uTime * 2.5 * speed) * 0.03;
    float mouseFalloff = exp(-distMouse * 8.0);
    pos.z += mouseWave * mouseFalloff * amp;

    // ── Click shockwave ──
    if (uIntensity > 0.005) {
      float distClick = distance(uv, uClickPos);
      float clickWave = sin(distClick * 40.0 - uTime * 4.0 * speed) * 0.06;
      float clickFalloff = exp(-distClick * 5.0) * uIntensity;
      pos.z += clickWave * clickFalloff * amp;
    }

    vElevation = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─────────────────────────────────────────────
// Fragment Shader — dynamic colors + audio glow
// ─────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAudioLevel;

  varying float vElevation;
  varying vec2 vUv;

  void main() {
    float heightFactor = smoothstep(-0.02, 0.08, vElevation);

    // More highlight when audio is active
    float highlightStrength = 0.2 + uAudioLevel * 0.4;
    vec3 color = mix(uColorA, uColorB, heightFactor * highlightStrength);

    // Vignette
    vec2 center = vUv - 0.5;
    float vignette = 1.0 - dot(center, center) * 0.4;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─────────────────────────────────────────────
// Camera
// ─────────────────────────────────────────────
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─────────────────────────────────────────────
// Dynamic background color matching deep color
// ─────────────────────────────────────────────
function DynamicBackground() {
  const { scene } = useThree();
  const color = useRef(new THREE.Color(0.02, 0.04, 0.08));

  useFrame(() => {
    const [r, g, b] = getColorDeep();
    color.current.setRGB(r * 0.5, g * 0.5, b * 0.5);
    scene.background = color.current;
  });

  return null;
}

// ─────────────────────────────────────────────
// Water scene — reads all state from water-state module
// ─────────────────────────────────────────────
function WaterScene() {
  const mouseTargetRef = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const clickRef = useRef({ pos: new THREE.Vector2(-1, -1), intensity: 0 });

  // Smooth color interpolation
  const currentDeep = useRef(new THREE.Vector3(0.039, 0.098, 0.184));
  const targetDeep = useRef(new THREE.Vector3(0.039, 0.098, 0.184));
  const currentHighlight = useRef(new THREE.Vector3(0.392, 1.0, 0.855));
  const targetHighlight = useRef(new THREE.Vector3(0.392, 1.0, 0.855));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uClickPos: { value: new THREE.Vector2(-1, -1) },
      uIntensity: { value: 0 },
      uAudioLevel: { value: 0 },
      uWaveSpeed: { value: 1.0 },
      uWaveIntensity: { value: 1.0 },
      uColorA: { value: new THREE.Vector3(0.039, 0.098, 0.184) },
      uColorB: { value: new THREE.Vector3(0.392, 1.0, 0.855) },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTargetRef.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight,
      );
    };
    const onDown = (e: PointerEvent) => {
      clickRef.current.pos.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight,
      );
      clickRef.current.intensity = 1.0;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;

    // Mouse
    mouseRef.current.lerp(mouseTargetRef.current, 0.05);
    uniforms.uMouse.value.copy(mouseRef.current);

    // Click decay
    clickRef.current.intensity *= 0.985;
    uniforms.uIntensity.value = clickRef.current.intensity;
    uniforms.uClickPos.value.copy(clickRef.current.pos);

    // Audio
    uniforms.uAudioLevel.value = updateAndGetAudioLevel();

    // Wave params
    uniforms.uWaveSpeed.value = getWaveSpeed();
    uniforms.uWaveIntensity.value = getWaveIntensity();

    // Smooth color transitions (0.025 lerp ≈ 1.5s transition)
    const deep = getColorDeep();
    targetDeep.current.set(deep[0], deep[1], deep[2]);
    currentDeep.current.lerp(targetDeep.current, 0.025);
    uniforms.uColorA.value.copy(currentDeep.current);

    const hi = getColorHighlight();
    targetHighlight.current.set(hi[0], hi[1], hi[2]);
    currentHighlight.current.lerp(targetHighlight.current, 0.025);
    uniforms.uColorB.value.copy(currentHighlight.current);
  });

  return (
    <>
      <CameraSetup />
      <DynamicBackground />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8, 128, 128]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────
// Exported canvas — persistent global background
// ─────────────────────────────────────────────
export function WaterRippleCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.8, 1.0], fov: 60 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <WaterScene />
    </Canvas>
  );
}
