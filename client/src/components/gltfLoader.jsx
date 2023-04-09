import React, { useMemo, useState, useRef } from 'react'
import { useLoader, Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Html, useProgress, Detailed, Environment } from '@react-three/drei'

function Bird () {
    const ref = useRef()
    const { nodes, materials } = useGLTF('bird.gltf')
    const material = new THREE.MeshPhongMaterial( {
        color: '#c08d6d',
        polygonOffset: true,
        polygonOffsetFactor: 1, 
        polygonOffsetUnits: 1
      } )
    return (
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.04, 0.04, 0.04]} position={[0, 10, 0]} rotation={[0, 0, 0]}>
            <mesh geometry={nodes.Bird.geometry} material={material} />
        </Detailed>
    )
}

function Nest () {
    const ref = useRef()
    const { nodes, materials } = useGLTF('nest.gltf')
    const material = new THREE.MeshPhongMaterial( {
        color: '#1f1f1f',
        polygonOffset: true,
        polygonOffsetFactor: 1, 
        polygonOffsetUnits: 1
      } )
    return (
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.15, 0.15, 0.15]} position={[2, 10, 0]} rotation={[0, 0, 0]}>
            <mesh geometry={nodes.barn021_Cube021.geometry} material={material} />
        </Detailed>
    )
}

const distanceToNest = (x, y) => { 
    return Math.sqrt(Math.pow(250000-x, 2)+Math.pow(250000-y, 2))
};

function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
}

function Ground () {
    const material = new THREE.MeshPhongMaterial( {
        color: '#484948',
        polygonOffset: true,
        polygonOffsetFactor: 1, 
        polygonOffsetUnits: 1
      } )
    const ref = useRef()
    const { nodes, materials } = useGLTF('ground.gltf')
    return (
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[150, 150, 150]}  rotation={[3*Math.PI/2, 0, 0]} position={[0, 0, 0]}>
            <mesh geometry={nodes.mesh_0.geometry} material={material} />
        </Detailed>
    )
}

function Drone({position}) {
        const material = new THREE.MeshPhongMaterial( {
            color: '#ffffff',
            polygonOffset: true,
            polygonOffsetFactor: 1, 
            polygonOffsetUnits: 1
        } )
        const ref = useRef()
        const camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,1,1000);
        const { nodes, materials } = useGLTF('drone.gltf')
        const [data] = useState({
            color: Math.floor(Math.random()*16777215).toString(16),
            y: position.y,
            x: position.x,
            spin: THREE.MathUtils.randFloat(8, 12),
        })
        const testmesh = nodes.mesh_0.geometry
        const sphere = new THREE.SphereGeometry(10, 21, 5)
        useFrame((state, dt) => {
            ref.current.position.set( position.x, position.y, position.z)
            ref.current.rotation.set(3*Math.PI/2, 0, data.spin*Date.now()/5000)
          })
        return (
            <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.0008, 0.0008, 0.0008]}>
                <mesh geometry={testmesh} material={material}/>
            </Detailed>
        )
    
}


export default function Drones({ currentlyInRadar }) {
    if (currentlyInRadar.length == 0) {
        return null
    } else {
        return (
        <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} camera={{ position: [0, 450, 150], fov: 20, near: 20, far: 600 }}>
            <OrbitControls />
            {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
            {Array.from(currentlyInRadar, (drone) => <Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/3500-80), y:(drone.altitude[0]/50-40), z: (drone.positionY[0]/3500-80)}} /> /* prettier-ignore */)}
            <ambientLight intensity={0.5} />
            <directionalLight intensity={0.6} />
            {/* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster) */}
            <Ground />
            <Bird />
            <Nest />
        </Canvas>
        )
    }
  }
  // {currentlyInRadar.map(drone => (<Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-150)}} />))}
  //{Array.from({ length: currentlyInRadar.length }, (drone, i) => <Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-150)}} /> /* prettier-ignore */)}