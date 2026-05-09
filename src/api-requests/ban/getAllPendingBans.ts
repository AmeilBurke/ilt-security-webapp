import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, Ban } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllPendingBans = async (): Promise<Ban[] | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.get("/bans/pending")
		.then((response: AxiosResponse) => {
			return response.data as Ban[];
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default getAllPendingBans;
