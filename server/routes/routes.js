import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi} from 'openai';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from API ROUTES" })
})

router.route('/drones', (req, response) => {
  try {
    Drone.find({}).then(drones => {
        response.json(drones)
    })
  } catch (error) {
    response.status(500).send({ error: '/api/drones error' })
    console.error(error);
    console.log('Error in /api/drones')
  }
})

router.route('/currentdrones', (req, response) => {
  try {
    getCurrentRadar().then(drones=> {response.json(drones)})
  } catch (error) {
    response.status(500).send({ error: '/api/currentdrones error' })
    console.error(error);
    console.log('Error in /api/currentdrones')
  }
})

export default router;