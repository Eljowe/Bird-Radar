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

  const renderDrones = drones.map(drone => (
    <tr key={drone.serialNumber}>
      <td>{drone.serialNumber}</td>
      <td>{calculateTimeOnList(drone.lastSeen)} minutes</td>
      <td>{(drone.closestToNest/1000).toFixed(1)} meters</td>
      {drone.pilotInformation ? 
        <td>{drone.pilotInformation.pilotId}</td> : null
      }
    </tr>
  ));

  useEffect(() => {
    handleGetDrones();
    const interval = setInterval(() => {
      handleGetDrones();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <AnimatePresence>
        <motion.section className='home' {...slideAnimation('left')}>
          <motion.header >
            <h1 className=''>Hello</h1>
            <p>again</p>
            <p>and again.</p>
            <button onClick={() => handleGetDrones()}>Get Drones</button>
          </motion.header>
        </motion.section>
      </AnimatePresence>
      {renderDrones}
    </div>
  )
}

export default App
