import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

export async function register(email, password) {
  const { data } = await client.post("/auth/register", { email, password });
  return data;
}

export async function login(email, password) {
  // FastAPI's OAuth2PasswordRequestForm expects form-encoded data, not JSON
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await client.post("/auth/login", form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  await AsyncStorage.setItem("access_token", data.access_token);
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem("access_token");
}

export async function isLoggedIn() {
  const token = await AsyncStorage.getItem("access_token");
  return !!token;
}
