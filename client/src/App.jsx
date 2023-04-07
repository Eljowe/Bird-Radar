import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from './config/motion'

import {motion, AnimatePresence} from 'framer-motion';

function App() {

  return (
    <AnimatePresence>
      <motion.section className='home' {...slideAnimation('left')}>
        <motion.header >
          <h1 className=''>Hello</h1>
          <p>again</p>
          <p>and again...!!!</p>
        </motion.header>
      </motion.section>
    </AnimatePresence>
  )
}

export default App
