import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getProfileFromJwt = async (jwtToken: string) => {
	return await axiosInstance
		.get("/authentication/profile")
		.then((response: AxiosResponse) => {
			return response;
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default getProfileFromJwt;
