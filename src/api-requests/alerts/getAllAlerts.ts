import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { Alert, ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllAlerts = async (): Promise<Alert[] | AxiosError | ApiRequestError> => {
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
