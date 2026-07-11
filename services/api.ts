import axios from 'axios';

const api = axios.create({
  baseURL: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000/api/v1' 
    : 'https://apidev.dvmsolution.co.in/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
