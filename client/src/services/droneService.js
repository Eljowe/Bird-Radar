import axios from 'axios'

const APIuri = 'http://localhost:8080/api/drones'

const ApiServeruri = 'https://birdserver.fly.dev/api/drones'

const currentRadarURI = 'http://localhost:8080/api/currentdrones'

const currentRadarURIProd = 'https://birdserver.fly.dev/api/currentdrones'

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