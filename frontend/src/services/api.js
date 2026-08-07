import axios from "axios";

const api = axios.create({
  baseURL: "https://bugtrack-backend-6pqn.onrender.com/api",
});

export default api;