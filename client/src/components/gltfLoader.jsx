/* eslint-disable react/no-unknown-property */
import React, { useMemo, useState, useRef } from 'react'
import { useLoader, Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Html, useProgress, Detailed, Environment, PerspectiveCamera, Loader } from '@react-three/drei'
import PropTypes from 'prop-types';

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
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.04, 0.04, 0.04]} position={[0, -10, 0]} rotation={[0, 0, 0]}>
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
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.15, 0.15, 0.15]} position={[2, -10, 0]} rotation={[0, 0, 0]}>
            <mesh geometry={nodes.barn021_Cube021.geometry} material={material} />
        </Detailed>
    )
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
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[150, 150, 150]}  rotation={[3*Math.PI/2, 0, 0]} position={[0, -20, 0]}>
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
            <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} camera={{ position: [0, 450, 150], fov: 20, near: 20, far: 3000 }} callback={<Loader/>}>
                <PerspectiveCamera makeDefault fov={20} position={[-200, 300, 300]} resolution={1024} far={3000}></PerspectiveCamera>
                <OrbitControls />
                {Array.from(currentlyInRadar, (drone) => <Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/3500-80), y:(drone.altitude[0]/50-60), z: (drone.positionY[0]/3500-80)}} /> /* prettier-ignore */)}
                <ambientLight intensity={0.5} />
                <directionalLight intensity={0.6} />
                <Ground />
                <Bird />
                <Nest />
            </Canvas>
        )
    }
}

Drones.propTypes = {
    currentlyInRadar: PropTypes.arrayOf(PropTypes.object).isRequired,
}

Drone.propTypes = {
    position: PropTypes.object.isRequired,
}