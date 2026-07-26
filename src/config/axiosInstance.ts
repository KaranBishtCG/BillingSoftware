import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7202/api', 
});

export default axiosInstance;