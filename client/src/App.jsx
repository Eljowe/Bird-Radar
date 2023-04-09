/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import {getDrones, getCurrent} from './services/droneService'
import {Model, Model2, Model3} from './components/model'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from "@react-three/drei";
import React from 'react';
//import Drones from './components/fbxLoader';

const Drones = React.lazy(() => import('./components/gltfLoader'));


function App() {
  const [drones, setDrones] = useState([])
  const [currentlyInRadar, setCurrentlyInRadar] = useState([])


  const handleGetDrones = async () => {
    const resp = await getDrones()
    setDrones([...resp])
    const current = await getCurrent()
    setCurrentlyInRadar([...current])
  }

  const calculateTimeOnList = (lastSeen) => {
    const currentTime = Date.now();
    const timeOnList = (currentTime - lastSeen) / 1000; // Convert milliseconds to seconds
    const minutes = Math.floor(timeOnList / 60);
    const seconds = Math.floor(timeOnList % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  const createDroneTable = drones.filter(drone => drone.closestToNest < 100000).map(drone => (
    <tbody>
      <tr key={drone.serialNumber}>
        <td key={drone.serialNumber} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.serialNumber}</td>
        <td key={drone.lastSeen} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{calculateTimeOnList(drone.lastSeen)} minutes</td>
        <td key={drone.closestToNest} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{(drone.closestToNest/1000).toFixed(1)} meters</td>
        {drone.pilotInformation ? 
          <td key={drone.pilotInformation[0].pilotId} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].pilotId}</td>: <td>none</td>
        }
        {drone.pilotInformation ? 
          <td key={drone.pilotInformation[0].firstName} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].firstName}</td>: <td>none</td>
        }
        {drone.pilotInformation ? 
          <td key={drone.pilotInformation[0].lastName} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].lastName}</td>: <td>none</td>
        }
        {drone.pilotInformation ? 
          <td key={drone.pilotInformation[0].phoneNumber} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].phoneNumber}</td>: <td>none</td>
        }
        {drone.pilotInformation ? 
          <td key={drone.pilotInformation[0].email} className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].email}</td>: <td>none</td>
        }
      </tr>
    </tbody>
  ));

  useEffect(() => {
    handleGetDrones();
    const interval = setInterval(() => {
      handleGetDrones();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const distanceToNest = (x, y) => { 
    return Math.sqrt(Math.pow(250000-x, 2)+Math.pow(250000-y, 2))
  };

  const renderCurrentlyInRadar = currentlyInRadar.map(drone => (
    //<Model3 key={drone.serialNumber[0]} scale={{x: 0.1, y:0.1, z: 0.1}} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-150)}} color={distanceToNest(drone.positionX, drone.positionY) < 100000 ? '#ff0000' : '#ffffff'} mesh={droneModel} />
    <Model2 key={drone.serialNumber[0]} scale={{x: 0.1, y:0.1, z: 0.1}} position={{x: (drone.positionX[0]/1300-200), y:(drone.altitude[0]/15-200), z: (drone.positionY[0]/1500-200)}} color={distanceToNest(drone.positionX, drone.positionY) < 100000 ? '#ff0000' : '#ffffff'} url="bird.obj" />
  ))


  return (
    <div className="">
      <div className="flex flex-col items-center justify-center py-2 mt-10 text-2xl">
        <h1>Drone radar app</h1>
      </div>
      <div className='h-[600px] border-2 border-white w-[1000px] m-auto mb-20 mt-10 rounded-xl'>
        <Suspense fallback={null}>
          <Drones currentlyInRadar={currentlyInRadar} />
        </Suspense>
      </div>
    
      <div className='h-[600px] border-2 border-white w-[1000px] m-auto mb-20 mt-10 rounded-xl' >
        <Canvas 
          camera={{position: [100, 400, 400], fov: 45}}
          style={{width: `100%`, height: `100%`, position: `relative` }}
        >
          <OrbitControls />
          <ambientLight intensity={0.6} />
          <directionalLight intensity={0.5} />
          <Model key={'bird'} scale={{x: 0.1, y:0.1, z: 0.1}} position={{x: 0, y:0, z: 0}} color={'#c08d6d'} url="bird.obj" />
          <Model key={'nest'} scale={{x: 0.5, y:0.5, z: 0.5}} position={{x: 5, y:0, z: 0}} color={'#382929'} url="nest.obj" />
          <Model key={'land'} scale={{x: 400, y:400, z: 400}} position={{x: 5, y:-28, z: 0}} color={'#484948'} url="land.obj" />
          {renderCurrentlyInRadar}
        </Canvas>
      </div>

      <table className=" table-auto border-collapse border-white text-sm sm:text-sm md:text-sm lg:text-md xl:text-l m-auto">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Serial Number</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Time on List</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Distance to Nest</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Pilot ID</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">First Name</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Last Name</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Phone Number</th>
              <th className="px-3 py-3 text-left text-white-600 font-bold border-b-2 border-white">Email</th>
            </tr>
          </thead>
          {[...createDroneTable]}
      </table>
    </div>
  )
}

export default App
