import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
});

export default axiosInstance;
