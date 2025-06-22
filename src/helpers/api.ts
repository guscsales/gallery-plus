import axios, {type AxiosRequestConfig} from "axios";

export const api = axios.create({
	baseURL: "http://localhost:5799",
});

export function fetcher(url: string, options: AxiosRequestConfig = {}) {
	return api.get(url, options).then((res) => res.data);
}
