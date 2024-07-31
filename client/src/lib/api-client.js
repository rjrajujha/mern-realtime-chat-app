import axios from "axios";
import { HOST } from "../utils/contants";

export const apiClient = axios.create({
    baseURL:HOST,
    
})