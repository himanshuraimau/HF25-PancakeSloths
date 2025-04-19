"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { MathUtils } from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

// Simplified globe visualization that doesn't rely on manipulating read-only properties
function Globe() {
  const globeRef = useRef(null)
  const glowRef = useRef(null)

  useFrame(({ clock }) => {
    if (globeRef.current) {
      // Rotate the globe
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }

    if (glowRef.current) {
      // Pulse the glow
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05
      glowRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group>
      {/* Main globe */}
      <group ref={globeRef}>
        <Sphere args={[1, 64, 64]}>
          <meshPhysicalMaterial
            color="#1E40AF"
            metalness={0.1}
            roughness={0.7}
            clearcoat={0.2}
            clearcoatRoughness={0.2}
          />
        </Sphere>

        {/* Continents */}
        <Sphere args={[1.01, 32, 32]}>
          <meshStandardMaterial color="#10B981" transparent opacity={0.6} wireframe={true} />
        </Sphere>

        {/* Project markers - static spheres at fixed positions */}
        <ProjectMarkers />
      </group>

      {/* Atmosphere glow */}
      <Sphere args={[1.05, 64, 64]} ref={glowRef}>
        <meshBasicMaterial color="#88ccff" transparent opacity={0.1} />
      </Sphere>
    </group>
  )
}

// Static project markers that don't need position updates
function ProjectMarkers() {
  // Predefined positions for markers (manually positioned)
  const markerPositions = [
    { position: [0, 1, 0], color: "#00A3FF", scale: 0.08 },
    { position: [0, -1, 0], color: "#4ADE80", scale: 0.07 },
    { position: [1, 0, 0], color: "#3B82F6", scale: 0.09 },
    { position: [-1, 0, 0], color: "#A855F7", scale: 0.08 },
    { position: [0.7, 0.7, 0], color: "#F59E0B", scale: 0.06 },
    { position: [-0.7, 0.7, 0], color: "#EC4899", scale: 0.07 },
    { position: [0.7, -0.7, 0], color: "#10B981", scale: 0.08 },
    { position: [-0.7, -0.7, 0], color: "#6366F1", scale: 0.07 },
  ]

  return (
    <group>
      {markerPositions.map((marker, index) => (
        <Marker key={index} {...marker} />
      ))}
    </group>
  )
}

// Individual marker with pulsing animation
function Marker({ position, color, scale }) {
  const markerRef = useRef(null)

  useFrame(({ clock }) => {
    if (markerRef.current) {
      // Pulse effect using scale
      const pulse = MathUtils.lerp(0.8, 1.2, (Math.sin(clock.getElapsedTime() * 2 + position[0] * 5) + 1) / 2)
      markerRef.current.scale.set(pulse * scale, pulse * scale, pulse * scale)
    }
  })

  return (
    <mesh position={position} ref={markerRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

// Energy field using a simple animated mesh
function EnergyField() {
  const fieldRef = useRef(null)

  useFrame(({ clock }) => {
    if (fieldRef.current) {
      // Rotate the energy field
      fieldRef.current.rotation.y = clock.getElapsedTime() * -0.05
      fieldRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <group ref={fieldRef}>
      {/* Create a field of small spheres in a spherical pattern */}
      {Array.from({ length: 100 }).map((_, i) => {
        // Distribute points on a sphere
        const phi = Math.acos(-1 + (2 * i) / 100)
        const theta = Math.sqrt(100 * Math.PI) * phi

        const x = 1.5 * Math.cos(theta) * Math.sin(phi)
        const y = 1.5 * Math.sin(theta) * Math.sin(phi)
        const z = 1.5 * Math.cos(phi)

        const color = i % 2 === 0 ? "#00A3FF" : "#4ADE80"
        const size = 0.02 + Math.random() * 0.01

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// Effects for visual enhancement
function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
    </EffectComposer>
  )
}

export function GlobeVisualization() {
  const [initialRender, setInitialRender] = useState(true)

  // After initial render, disable auto-rotation
  useEffect(() => {
    if (initialRender) {
      const timer = setTimeout(() => {
        setInitialRender(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [initialRender])

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, -10]} intensity={0.5} color="#ffffff" />

      <Globe />
      <EnergyField />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate={initialRender}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI - 0.5}
        minPolarAngle={0.5}
      />
      <Effects />
    </Canvas>
  )
}
