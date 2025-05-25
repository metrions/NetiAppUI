import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'

const BACK_URL = "http://192.168.0.105:8080";

axios.interceptors.request.use(
    config => {
        const token = AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export async function getSessions(subject) {
    const response = await axios.get(`${BACK_URL}/session/${subject.id}`);
    return response.data;
}