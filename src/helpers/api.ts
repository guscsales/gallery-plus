import axios, {type AxiosRequestConfig} from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

export function fetcher(url: string, options: AxiosRequestConfig = {}) {
	return api.get(url, options).then((res) => res.data);
}
