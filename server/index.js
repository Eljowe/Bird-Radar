import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fetchDataAndParseToSchema from './services/droneService.js';
import routes from './routes/routes.js';
import Drone from './models/drone.js';
import getCurrentRadar from './services/xmlProxyService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limig: "50mb" }))

app.use("/api", routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from root" })
})

app.get('/api/drones', (req, response) => {
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

app.get('/api/currentdrones', (req, response) => {
  try {
    getCurrentRadar().then(drones=> {response.json(drones)})
  } catch (error) {
    response.status(500).send({ error: '/api/currentdrones error' })
    console.error(error);
    console.log('Error in /api/currentdrones')
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const interval = setInterval(() => {
  fetchDataAndParseToSchema();
}, 3000);

app.listen(8080, () => console.log('Server has started on port 8080'))