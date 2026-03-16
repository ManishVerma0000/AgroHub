import axios from 'axios';

const api = axios.create({
  baseURL:"https://api.healthvandanam.com/api/v1/categories/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
