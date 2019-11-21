import axios from 'axios';


const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// token- 4fa69287b8ce858ed85b81c4314971010547c404
