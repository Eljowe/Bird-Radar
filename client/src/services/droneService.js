import axios from 'axios'


const ApiUriProd = 'https://birdserver.fly.dev/api/drones'

const currentRadarURIProd = 'https://birdserver.fly.dev/api/currentdrones'

var APIuri = 'http://localhost:8080/api/drones'

var currentRadarURI = 'http://localhost:8080/api/currentdrones'

if (process.env.NODE_ENV === 'production') {
    APIuri = ApiUriProd
    currentRadarURI = currentRadarURIProd
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