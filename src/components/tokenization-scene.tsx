"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Float,
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  RoundedBox,
  TorusKnot,
  Icosahedron,
  Octahedron,
  Text3D,
} from "@react-three/drei"
import { type Mesh, type Group, MathUtils } from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

interface TokenizationSceneProps {
  step: number
  assetType: string
  assetValue: number
  tokenizationPercent: number
}

// Add this at the beginning of the component function
export function TokenizationScene({
  step,
  assetType,
  assetValue,
  tokenizationPercent,
}: {
  step: number
  assetType: string
  assetValue: number
  tokenizationPercent: number
}) {
  // Add error boundary
  try {
    const [selectedElement, setSelectedElement] = useState<string | null>(null)

    const handleAssetClick = () => {
      setSelectedElement(selectedElement === "asset" ? null : "asset")
    }

    const handleTokenClick = () => {
      setSelectedElement(selectedElement === "token" ? null : "token")
    }

    function AssetModel({ assetType, step, onClick }: { assetType: string; step: number; onClick: () => void }) {
      const group = useRef<Group>(null)
      const [hover, setHover] = useState(false)
      const isActive = step >= 2

      useFrame((state) => {
        if (group.current) {
          // Base rotation
          group.current.rotation.y = state.clock.getElapsedTime() * 0.2

          // Add some movement based on step
          if (step === 1) {
            group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1
          } else if (step === 2) {
            group.current.scale.x = MathUtils.lerp(group.current.scale.x, hover ? 1.1 : 1, 0.1)
            group.current.scale.y = MathUtils.lerp(group.current.scale.y, hover ? 1.1 : 1, 0.1)
            group.current.scale.z = MathUtils.lerp(group.current.scale.z, hover ? 1.1 : 1, 0.1)
          }
        }
      })

      // Different models based on asset type
      const renderAsset = () => {
        switch (assetType) {
          case "property":
            return (
              <group>
                <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={4}>
                  <MeshDistortMaterial
                    color="#00A3FF"
                    distort={hover ? 0.3 : 0.1}
                    speed={2}
                    transparent
                    opacity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </RoundedBox>
                <RoundedBox args={[0.5, 0.8, 0.5]} radius={0.1} smoothness={4} position={[0, 1, 0]}>
                  <MeshDistortMaterial
                    color="#00A3FF"
                    distort={hover ? 0.3 : 0.1}
                    speed={2}
                    transparent
                    opacity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </RoundedBox>
                <RoundedBox args={[1.8, 0.2, 1.8]} radius={0.05} smoothness={4} position={[0, -0.85, 0]}>
                  <MeshDistortMaterial
                    color="#00A3FF"
                    distort={hover ? 0.3 : 0.1}
                    speed={2}
                    transparent
                    opacity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </RoundedBox>
              </group>
            )
          case "art":
            return (
              <TorusKnot args={[0.8, 0.3, 128, 32]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                  color="#A742F5"
                  distort={hover ? 0.4 : 0.2}
                  speed={hover ? 3 : 1.5}
                  transparent
                  opacity={0.8}
                  metalness={0.6}
                  roughness={0.2}
                />
              </TorusKnot>
            )
          case "intellectual":
            return (
              <group>
                <Octahedron args={[1, 0]} position={[0, 0, 0]}>
                  <MeshDistortMaterial
                    color="#3B82F6"
                    distort={hover ? 0.3 : 0.1}
                    speed={hover ? 2.5 : 1.2}
                    transparent
                    opacity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </Octahedron>
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                  <torusGeometry args={[1.2, 0.05, 16, 100]} />
                  <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.2} transparent opacity={0.6} />
                </mesh>
              </group>
            )
          case "environmental":
            return (
              <group>
                <Icosahedron args={[1, 1]} position={[0, 0, 0]}>
                  <MeshDistortMaterial
                    color="#4ADE80"
                    distort={hover ? 0.3 : 0.1}
                    speed={hover ? 2 : 1}
                    transparent
                    opacity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </Icosahedron>
                <mesh position={[0, 0, 0]}>
                  <torusGeometry args={[1.2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]} />
                  <meshStandardMaterial color="#4ADE80" metalness={0.9} roughness={0.2} transparent opacity={0.6} />
                </mesh>
              </group>
            )
          default:
            return (
              <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={4}>
                <MeshDistortMaterial
                  color="#00A3FF"
                  distort={hover ? 0.3 : 0.1}
                  speed={2}
                  transparent
                  opacity={0.8}
                  metalness={0.5}
                  roughness={0.2}
                />
              </RoundedBox>
            )
        }
      }

      return (
        <group
          ref={group}
          onClick={onClick}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          position={[step >= 3 ? -2 : 0, 0, 0]}
        >
          {renderAsset()}
        </group>
      )
    }

    function TokenizedAsset({
      percent,
      assetType,
      step,
      onClick,
    }: {
      percent: number
      assetType: string
      step: number
      onClick: () => void
    }) {
      const meshRef = useRef<Mesh>(null)
      const [hover, setHover] = useState(false)
      const isActive = step >= 3

      useFrame((state) => {
        if (meshRef.current) {
          meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
          meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3

          // Pulse effect when active
          if (isActive && hover) {
            meshRef.current.scale.x =
              meshRef.current.scale.y =
              meshRef.current.scale.z =
                (percent / 100) * (1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1)
          }
        }
      })

      // Scale based on tokenization percent
      const scale = percent / 100

      // Different colors based on asset type
      const getColor = () => {
        switch (assetType) {
          case "property":
            return "#00A3FF"
          case "art":
            return "#A742F5"
          case "intellectual":
            return "#3B82F6"
          case "environmental":
            return "#4ADE80"
          default:
            return "#00A3FF"
        }
      }

      if (!isActive) return null

      return (
        <Float speed={2} rotationIntensity={hover ? 2 : 1} floatIntensity={hover ? 2 : 1}>
          <group position={[2, 0, 0]}>
            <mesh
              ref={meshRef}
              scale={[scale, scale, scale]}
              onClick={onClick}
              onPointerOver={() => setHover(true)}
              onPointerOut={() => setHover(false)}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <MeshTransmissionMaterial
                color={getColor()}
                distortion={hover ? 0.8 : 0.5}
                thickness={0.5}
                transmission={1}
                roughness={0.1}
                metalness={0.1}
                ior={1.5}
                temporalDistortion={hover ? 0.4 : 0.2}
              />
            </mesh>

            {/* Token particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.sin((i / 8) * Math.PI * 2) * 1.5 * scale,
                  Math.cos((i / 8) * Math.PI * 2) * 1.5 * scale,
                  0,
                ]}
                scale={[0.1 * scale, 0.1 * scale, 0.1 * scale]}
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={2} />
              </mesh>
            ))}
          </group>
        </Float>
      )
    }

    function StepVisualizer({
      step,
      assetValue,
      tokenizationPercent,
    }: { step: number; assetValue: number; tokenizationPercent: number }) {
      const tokenizedValue = (assetValue * tokenizationPercent) / 100

      if (step === 1) {
        return (
          <group position={[0, -2, 0]}>
            <Text3D
              font="/fonts/inter_bold.json"
              size={0.3}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[-2, 0, 0]}
            >
              Select Asset Type
              <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.2} />
            </Text3D>
          </group>
        )
      }

      if (step === 2) {
        return (
          <group position={[0, -2, 0]}>
            <Text3D
              font="/fonts/inter_bold.json"
              size={0.3}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[-2, 0, 0]}
            >
              Verify Documents
              <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.2} />
            </Text3D>
          </group>
        )
      }

      if (step === 3) {
        return (
          <group position={[0, -2, 0]}>
            <Text3D
              font="/fonts/inter_bold.json"
              size={0.25}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[-4, 0, 0]}
            >
              ${assetValue.toLocaleString()}
              <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.2} />
            </Text3D>

            <Text3D
              font="/fonts/inter_bold.json"
              size={0.25}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[-0.5, 0, 0]}
            >
              {tokenizationPercent}%
              <meshStandardMaterial color="#4ADE80" metalness={0.5} roughness={0.2} />
            </Text3D>

            <Text3D
              font="/fonts/inter_bold.json"
              size={0.25}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[2, 0, 0]}
            >
              ${tokenizedValue.toLocaleString()}
              <meshStandardMaterial color="#00A3FF" metalness={0.5} roughness={0.2} />
            </Text3D>
          </group>
        )
      }

      if (step === 4) {
        return (
          <group position={[0, -2, 0]}>
            <Text3D
              font="/fonts/inter_bold.json"
              size={0.3}
              height={0.05}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.01}
              bevelSize={0.01}
              bevelOffset={0}
              bevelSegments={5}
              position={[-2.5, 0, 0]}
            >
              Ready to Tokenize
              <meshStandardMaterial color="#4ADE80" metalness={0.5} roughness={0.2} />
            </Text3D>
          </group>
        )
      }

      return null
    }

    function Particles({ count = 100, step }: { count?: number; step: number }) {
      const mesh = useRef<Group>(null)
      const particlesRef = useRef<
        Array<{
          position: [number, number, number]
          scale: number
          speed: number
          offset: number
        }>
      >([])

      // Initialize particles with random positions
      useEffect(() => {
        particlesRef.current = Array.from({ length: count }).map(() => ({
          position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
          scale: Math.random() * 0.1 + 0.03,
          speed: Math.random() * 0.5 + 0.5,
          offset: Math.random() * Math.PI * 2,
        }))
      }, [count])

      useFrame((state) => {
        if (mesh.current) {
          mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05

          // More active particles in later steps
          const intensity = step * 0.25

          // Update each particle child
          mesh.current.children.forEach((particle, i) => {
            const data = particlesRef.current[i]
            if (data && particle instanceof Mesh) {
              // Pulsing effect
              particle.scale.x =
                particle.scale.y =
                particle.scale.z =
                  data.scale * (1 + Math.sin(state.clock.getElapsedTime() * data.speed + data.offset) * 0.3 * intensity)

              // Subtle movement
              particle.position.y +=
                Math.sin(state.clock.getElapsedTime() * data.speed + data.offset) * 0.01 * intensity
            }
          })
        }
      })

      return (
        <group ref={mesh}>
          {particlesRef.current.map((particle, i) => (
            <mesh key={i} position={particle.position} scale={[particle.scale, particle.scale, particle.scale]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#00A3FF" : "#4ADE80"} transparent opacity={0.3 + step * 0.1} />
            </mesh>
          ))}
        </group>
      )
    }

    function TokenizationConnection({ step, percent }: { step: number; percent: number }) {
      const lineRef = useRef<Mesh>(null)

      useFrame((state) => {
        if (lineRef.current && step >= 3) {
          // Animate the connection line
          lineRef.current.scale.x = MathUtils.lerp(lineRef.current.scale.x, percent / 100, 0.1)

          // Pulse effect
          const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1
          lineRef.current.scale.y = lineRef.current.scale.z = 0.05 * pulse
        }
      })

      if (step < 3) return null

      return (
        <mesh ref={lineRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshBasicMaterial color="#4ADE80" transparent opacity={0.6} />
        </mesh>
      )
    }

    function Effects() {
      return (
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      )
    }

    // Rest of your component code remains the same
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold text-blue-400">
            {step === 4 ? (
              <span className="text-teal-400">${((assetValue * tokenizationPercent) / 100).toLocaleString()}</span>
            ) : (
              <span>${assetValue.toLocaleString()}</span>
            )}
          </div>
          <div className="text-lg text-slate-400">
            {step === 1 && "Select your asset type and details"}
            {step === 2 && "Upload verification documents"}
            {step === 3 && `Tokenize ${tokenizationPercent}% of your ${assetType}`}
            {step === 4 && "Ready to tokenize on the blockchain"}
          </div>
        </div>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={["#f8fafc"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} intensity={0.5} />

          <AssetModel assetType={assetType} step={step} onClick={handleAssetClick} />
          <TokenizedAsset percent={tokenizationPercent} assetType={assetType} step={step} onClick={handleTokenClick} />
          <TokenizationConnection step={step} percent={tokenizationPercent} />
          <StepVisualizer step={step} assetValue={assetValue} tokenizationPercent={tokenizationPercent} />
          <Particles count={50} step={step} />

          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!selectedElement}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
          <Effects />
        </Canvas>
      </div>
    )
  } catch (error) {
    console.error("Error rendering TokenizationScene:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center text-slate-400">
          <p>Visualization unavailable</p>
        </div>
      </div>
    )
  }
}
