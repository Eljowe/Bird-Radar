import https from 'https';
import xml2json from 'xml2js';
import droneSchema from '../models/drone.js';

const distanceToNest = (x, y) => { 
  try {
    return Math.sqrt(Math.pow(250000-x, 2)+Math.pow(250000-y, 2))
  } catch (error) {
    console.error(error);
  }
};

const getPilotInfo = (drone) => {
  try {
    return new Promise((resolve, reject) => {
      https.get(`https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber[0]}`, (response) => {
        let data2 = '';
        response.on('data', (chunk) => {
          data2 += chunk;
        });
        
        response.on('end', () => {
          const pilotInfo = JSON.parse(data2);
          resolve(pilotInfo);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export default async function fetchDataAndParseToSchema() {
    try {
      let arr = [];
        https.get("https://assignments.reaktor.com/birdnest/drones", (res) => {
          let data = '';
          
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', async () => {
          // Parse XML to JSON
          const result = await xml2json.parseStringPromise(data);
          arr =result.report.capture[0].drone
          const drones = arr
          
          // Update or insert drones in the database
          for (const drone of drones) {
            const existingDrone = await droneSchema.findOne({ serialNumber: drone.serialNumber[0] });
            if (existingDrone) {
              // Update existing drone
              let closestToNestUpdate = existingDrone.closestToNest;
              if (distanceToNest(Number(drone.positionX[0]), Number(drone.positionY[0])) < closestToNestUpdate) {
                  closestToNestUpdate = distanceToNest(Number(drone.positionX[0]), Number(drone.positionY[0]))
              }

              let pilotInfo = existingDrone.pilotInformation;
              if (closestToNestUpdate < 100000 && existingDrone.pilotInformation === null) {
                  pilotInfo = await getPilotInfo(drone);
              }
              
              await droneSchema.findOneAndUpdate({ serialNumber: drone.serialNumber[0] }, {
                closestToNest: closestToNestUpdate,
                lastSeen: Date.now(),
                x: drone.positionX[0],
                y: drone.positionY[0],
                pilotInformation: pilotInfo,
              });
            } else {
              // Insert new drone
              if(distanceToNest(Number(drone.positionX[0]), Number(drone.positionY[0])) < 100000) {
                await droneSchema.create({ 
                    serialNumber: drone.serialNumber[0],
                    closestToNest: distanceToNest(Number(drone.positionX[0]), Number(drone.positionY[0])),
                    lastSeen: Date.now(),
                    x: drone.positionX[0],
                    y: drone.positionY[0],
                    pilotInformation: distanceToNest(Number(drone.positionX[0]), Number(drone.positionY[0])) < 100000 ? await getPilotInfo(drone) : null,
                  });
              }
            }
          }
    
          // Delete data older than 10 minutes
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
          await droneSchema.deleteMany({ lastSeen: { $lt: tenMinutesAgo } });
        });
      })
    } catch (error) {
      console.error(error);
    }
};
  
  