import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL ;
const api = axios.create({ baseURL: API_URL + '/api' });

export function setAuth(token) {
  if (token) api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  else delete api.defaults.headers.common['Authorization'];
}
export default api;
