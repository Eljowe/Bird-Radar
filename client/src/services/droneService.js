import axios from 'axios'

var APIuri = 'http://localhost:8080/api/drones'
var currentRadarURI = 'http://localhost:8080/api/currentdrones'

if (process.env.NODE_ENV === 'production') {
    APIuri = 'https://birdserver.fly.dev/api/drones'
    currentRadarURI = 'https://birdserver.fly.dev/api/currentdrones'
}

const getDrones = async () => {
    let drones = []
    try {
        const response = await axios.get(APIuri)
        drones = response.data
        
        return drones;
    } catch (error) {
        console.error(error)
    }
}

const getCurrent = async () => {
    let drones = []
    try {
        const response = await axios.get(currentRadarURI)
        drones = response.data
        return drones;
    } catch (error) {
        console.error(error)
    }
}

export { getDrones, getCurrent }