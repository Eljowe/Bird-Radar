import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import getDrones from './services/droneService'

import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from './config/motion'

import {motion, AnimatePresence} from 'framer-motion';

function App() {
  const [drones, setDrones] = useState([])

  const handleGetDrones = async () => {
    const resp = await getDrones.getDrones()
    setDrones([...resp])
  }

  const calculateTimeOnList = (lastSeen) => {
    const currentTime = Date.now();
    const timeOnList = (currentTime - lastSeen) / 1000; // Convert milliseconds to seconds
    const minutes = Math.floor(timeOnList / 60);
    const seconds = Math.floor(timeOnList % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  const renderDrones = drones.filter(drone => drone.closestToNest < 100000).map(drone => (
    <tr key={drone.serialNumber}>
      <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.serialNumber}</td>
      <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{calculateTimeOnList(drone.lastSeen)} minutes</td>
      <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{(drone.closestToNest/1000).toFixed(1)} meters</td>
      {drone.pilotInformation ? 
        <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].pilotId}</td>: <td>none</td>
      }
      {drone.pilotInformation ? 
        <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].firstName}</td>: <td>none</td>
      }
      {drone.pilotInformation ? 
        <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].lastName}</td>: <td>none</td>
      }
      {drone.pilotInformation ? 
        <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].phoneNumber}</td>: <td>none</td>
      }
      {drone.pilotInformation ? 
        <td className="px-3 py-3 text-left text-white-600 border-b-2 border-white">{drone.pilotInformation[0].email}</td>: <td>none</td>
      }
    </tr>
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

  return (
    <div className="">
      <AnimatePresence>
        <motion.section className='home' {...slideAnimation('left')}>
          <motion.header >
            <h1 className=''>Hello</h1>
          </motion.header>
        </motion.section>
      </AnimatePresence>
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
          {renderDrones}
      </table>
    </div>
  )
}

export default App
