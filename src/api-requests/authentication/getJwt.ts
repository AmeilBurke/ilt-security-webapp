import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getJwt = async (email: string, password: string): Promise<{ access_token: string } | ApiRequestError | AxiosError> => {
	return await axiosInstance
		.post("/authentication/sign-in", {
			email: email,
			password: password,
		})
		.then((response: AxiosResponse) => {
			return response.data as { access_token: string };
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default getJwt;
