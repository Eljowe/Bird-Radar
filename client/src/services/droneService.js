import axios from 'axios'

const APIuri = 'http://localhost:8080/api/drones'

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

export default { getDrones }