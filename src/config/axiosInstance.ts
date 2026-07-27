import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://elixirsolutions20260727095148-fffvbjdtercbasds.centralindia-01.azurewebsites.net/api', 
});

export default axiosInstance;