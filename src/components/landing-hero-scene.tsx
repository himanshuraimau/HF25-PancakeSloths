"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Vector3, Color } from "three"

function Particles({ count = 200 }) {
  const mesh = useRef()
  const particlesData = useRef([])

  // Initialize particles
  useEffect(() => {
    particlesData.current = Array.from({ length: count }).map(() => ({
      position: new Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20),
      velocity: new Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
      color: new Color().setHSL(Math.random(), 0.7, 0.5),
      size: Math.random() * 0.1 + 0.05,
    }))
  }, [count])

  useFrame(() => {
    if (mesh.current) {
      const particles = mesh.current.geometry.attributes.position
      const colors = mesh.current.geometry.attributes.color

      particlesData.current.forEach((particle, i) => {
        // Update position
        particle.position.add(particle.velocity)

        // Boundary check
        if (particle.position.length() > 10) {
          particle.position.multiplyScalar(0.9)
          particle.velocity.multiplyScalar(-0.9)
        }

        // Update geometry
        particles.setXYZ(i, particle.position.x, particle.position.y, particle.position.z)
        colors.setXYZ(i, particle.color.r, particle.color.g, particle.color.b)
      })

      particles.needsUpdate = true
      colors.needsUpdate = true
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(count * 3)} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={new Float32Array(count * 3)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
    </EffectComposer>
  )
}

export function LandingHeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <Particles count={200} />
      <Effects />
    </Canvas>
  )
}
