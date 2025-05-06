import Constants from "expo-constants";
import axios from "axios";

const BACK_URL = "http://192.168.0.108:8080";

export async function getSessions(subject) {
    const response = await axios.get(`${BACK_URL}/session/${subject.id}`);
    return response.data;
}