import React, { useMemo, useState, useRef } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader, Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Html, useProgress, Detailed, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'


const BasicMaterial = new THREE.MeshPhongMaterial( {
    color: '#ffffff',
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
} )

const distanceToNest = (x, y) => { 
    return Math.sqrt(Math.pow(250000-x, 2)+Math.pow(250000-y, 2))
};


function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
}

function Ground () {
    const material = new THREE.MeshPhongMaterial( {
        color: '#062207',
        polygonOffset: true,
        polygonOffsetFactor: 1, 
        polygonOffsetUnits: 1
      } )
    const ref = useRef()
    const { nodes, materials } = useGLTF('ground.gltf')
    //console.log(nodes.mesh_0)
    return (
        <Detailed ref={ref} distances={[0, 50, 100]} scale={[150, 150, 150]}  rotation={[3*Math.PI/2, 0, 0]} position={[0, 0, 0]}>
            <mesh geometry={nodes.mesh_0.geometry} material={material} />
        </Detailed>
    )
}

function Drone({position}) {
        const color= distanceToNest(position.x, position.y) < 100000 ? '#ff0000' : '#ffffff'
        const material = new THREE.MeshPhongMaterial( {
            color: color,
            polygonOffset: true,
            polygonOffsetFactor: 1, 
            polygonOffsetUnits: 1
        } )
        const ref = useRef()
        const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,5000);

        const { nodes, materials } = useGLTF('drone.gltf')

        const [data] = useState({
            color: Math.floor(Math.random()*16777215).toString(16),
            // Randomly distributing the objects along the vertical
            y: position.y,
            // This gives us a random value between -1 and 1, we will multiply it with the viewport width
            x: position.x,
            // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
            spin: THREE.MathUtils.randFloat(8, 12),
        })
        const testmesh = nodes.mesh_0.geometry
        const sphere = new THREE.SphereGeometry(10, 21, 5)
        useFrame((state, dt) => {
            ref.current.position.set( position.x, position.y, position.z)
            ref.current.rotation.set(3*Math.PI/2, 0, data.spin*Date.now()/5000)
          })
        
        return (
            <Detailed ref={ref} distances={[0, 50, 100]} scale={[0.001, 0.001, 0.001]}>
                <mesh geometry={testmesh} material={material}/>
            </Detailed>
        )
    
}


export default function Drones({ currentlyInRadar }) {
    if (currentlyInRadar.length == 0) {
        return null
    } else {
        return (
        // No need for antialias (faster), dpr clamps the resolution to 1.5 (also faster than full resolution)
        <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 450, 150], fov: 20, near: 20, far: 600 }}>
            <OrbitControls />
            <spotLight position={[80, 90, 120]} penumbra={1} intensity={3} color="white" />
            {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
            {Array.from(currentlyInRadar, (drone) => <Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/3500-80), y:(drone.altitude[0]/50-60), z: (drone.positionY[0]/3500-80)}} /> /* prettier-ignore */)}
            <ambientLight intensity={1} />
            {/* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster) */}
            <Ground />
        </Canvas>
        )
    }
  }
  // {currentlyInRadar.map(drone => (<Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-150)}} />))}
  //{Array.from({ length: currentlyInRadar.length }, (drone, i) => <Drone key={drone.serialNumber[0]} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-150)}} /> /* prettier-ignore */)}