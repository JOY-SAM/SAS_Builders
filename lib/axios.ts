import axios from 'axios';

// Create an Axios instance with the base URL from the environment variable
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_URL || 'http://localhost:3000/',
});

// TODO later: Set the Authorization header
// api.defaults.headers.common['Authorization'] = AUTH_TOKEN; 

export default api;
