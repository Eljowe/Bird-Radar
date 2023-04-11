import response, { json } from 'express';
import https from 'https';
import xml2json from 'xml2js';
import droneSchema from '../models/drone.js';
import http from 'http';
import mongoose from 'mongoose';
import drone from '../models/drone.js';

export default function getCurrentRadar() {
  return new Promise((resolve, reject) => {
    let arr = [];
    https.get("https://assignments.reaktor.com/birdnest/drones", (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        const result = await xml2json.parseStringPromise(data);
        arr = result.report.capture[0].drone;
        resolve(arr);
      });
    }).on('error', (err) => {
      resolve(null);
      return null
      reject(err);
    });
  });
}