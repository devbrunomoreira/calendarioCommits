import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "token 7ea09e90ee01b39a2e36f42656a070faf63503e8"
  }
});

export default api;

//token- 4fa69287b8ce858ed85b81c4314971010547c404
