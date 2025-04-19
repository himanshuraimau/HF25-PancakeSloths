"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Float,
  Environment,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Text3D,
  RoundedBox,
  Torus,
} from "@react-three/drei"
import { Vector3, type Mesh, type Group, MathUtils } from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

function VaultModel({ isHovered, onClick }) {
  const group = useRef<Group>(null)
  const innerGroup = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const localHover = hover || isHovered

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
    if (innerGroup.current) {
      innerGroup.current.rotation.y = state.clock.getElapsedTime() * -0.2
      innerGroup.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1

      // Scale effect on hover
      innerGroup.current.scale.x = MathUtils.lerp(innerGroup.current.scale.x, localHover ? 1.1 : 1, 0.1)
      innerGroup.current.scale.y = MathUtils.lerp(innerGroup.current.scale.y, localHover ? 1.1 : 1, 0.1)
      innerGroup.current.scale.z = MathUtils.lerp(innerGroup.current.scale.z, localHover ? 1.1 : 1, 0.1)
    }
  })

  return (
    <group ref={group} onClick={onClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      {/* Outer vault structure */}
      <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.2} smoothness={4} position={[0, 0, 0]}>
        <MeshWobbleMaterial
          color="#00A3FF"
          factor={localHover ? 0.6 : 0.2}
          speed={localHover ? 2 : 1}
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Inner vault elements */}
      <group ref={innerGroup}>
        {/* Core sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color="#4ADE80"
            distort={localHover ? 0.6 : 0.3}
            speed={localHover ? 4 : 2}
            transparent
            opacity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Decorative rings */}
        <Torus args={[1.2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#00A3FF" metalness={0.9} roughness={0.2} />
        </Torus>
        <Torus args={[1.2, 0.05, 16, 100]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#4ADE80" metalness={0.9} roughness={0.2} />
        </Torus>
      </group>
    </group>
  )
}

function AssetSphere({
  position,
  color,
  speed,
  size,
  assetType,
  isHovered,
  onClick,
}: {
  position: [number, number, number]
  color: string
  speed: number
  size: number
  assetType: string
  isHovered: boolean
  onClick: () => void
}) {
  const mesh = useRef<Mesh>(null)
  const initialPosition = useRef(new Vector3(...position))
  const [hover, setHover] = useState(false)
  const localHover = hover || isHovered

  useFrame((state) => {
    if (mesh.current) {
      // Orbit around the center
      const angle = state.clock.getElapsedTime() * speed
      mesh.current.position.x = initialPosition.current.x * Math.cos(angle)
      mesh.current.position.z = initialPosition.current.z * Math.sin(angle)

      // Pulse effect on hover
      mesh.current.scale.x =
        mesh.current.scale.y =
        mesh.current.scale.z =
          size * (1 + (localHover ? Math.sin(state.clock.getElapsedTime() * 5) * 0.1 : 0))
    }
  })

  // Different geometries based on asset type
  const renderGeometry = () => {
    switch (assetType) {
      case "property":
        return <RoundedBox args={[1, 1, 1]} radius={0.2} smoothness={4} />
      case "art":
        return <torusKnotGeometry args={[0.5, 0.2, 128, 32]} />
      case "environmental":
        return <icosahedronGeometry args={[0.7, 1]} />
      case "intellectual":
        return <octahedronGeometry args={[0.7, 0]} />
      default:
        return <sphereGeometry args={[0.7, 32, 32]} />
    }
  }

  return (
    <Float speed={2} rotationIntensity={localHover ? 2 : 1} floatIntensity={localHover ? 2 : 1}>
      <mesh
        ref={mesh}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {renderGeometry()}
        <MeshDistortMaterial
          color={color}
          distort={localHover ? 0.4 : 0.2}
          speed={localHover ? 5 : 3}
          transparent
          opacity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

export function HeroScene() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  const assetTypes = [
    { id: "property", position: [3, 0, 0], color: "#00A3FF", speed: 0.5, size: 0.5 },
    { id: "art", position: [-2, 1, 2], color: "#4ADE80", speed: 0.7, size: 0.4 },
    { id: "environmental", position: [0, -2, 3], color: "#3B82F6", speed: 0.3, size: 0.6 },
    { id: "intellectual", position: [2, 2, -1], color: "#A855F7", speed: 0.6, size: 0.3 },
  ]

  const handleAssetClick = (assetId: string) => {
    setSelectedAsset(assetId === selectedAsset ? null : assetId)
  }

  const Effects = () => {
    return (
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    )
  }

  const AssetInfo = ({ assetId }: { assetId: string }) => {
    const { camera } = useThree()
    const asset = assetTypes.find((a) => a.id === assetId)

    useEffect(() => {
      if (asset) {
        // Move camera to focus on the selected asset
        const targetPosition = new Vector3(...asset.position).multiplyScalar(0.8)
        targetPosition.z += 5
        camera.position.lerp(targetPosition, 0.5)
      } else {
        // Reset camera position
        camera.position.set(0, 0, 8)
      }
    }, [asset, camera])

    if (!asset) return null

    return (
      <group position={[asset.position[0] * 0.8, asset.position[1] * 0.8 + 1, asset.position[2] * 0.8]}>
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
        >
          {asset.id.charAt(0).toUpperCase() + asset.id.slice(1)}
          <meshStandardMaterial color={asset.color} metalness={0.8} roughness={0.2} />
        </Text3D>
      </group>
    )
  }

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, -10, -10]} intensity={0.5} />

      <VaultModel
        isHovered={hoveredItem === "vault"}
        onClick={() => setHoveredItem(hoveredItem === "vault" ? null : "vault")}
      />

      {/* Orbiting asset spheres */}
      {assetTypes.map((asset) => (
        <AssetSphere
          key={asset.id}
          position={asset.position as [number, number, number]}
          color={asset.color}
          speed={asset.speed}
          size={asset.size}
          assetType={asset.id}
          isHovered={hoveredItem === asset.id || selectedAsset === asset.id}
          onClick={() => handleAssetClick(asset.id)}
        />
      ))}

      {selectedAsset && <AssetInfo assetId={selectedAsset} />}

      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!selectedAsset}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
      <Effects />
    </Canvas>
  )
}
