import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


// - Android emulator: http://10.0.2.2:8000
// - iOS simulator: http://localhost:8000
// - Physical device: http://<your-computer-LAN-IP>:8000
export const BASE_URL = "http://192.168.0.104:8000";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
