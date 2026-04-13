import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllAlerts = async () => {
	return await axiosInstance
		.get("/alerts")
		.then((response: AxiosResponse) => {
			return response.data;
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default getAllAlerts;
