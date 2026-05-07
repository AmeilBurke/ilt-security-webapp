import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, ProfileDetailsFromJwt } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getProfileFromJwt = async (): Promise<ProfileDetailsFromJwt | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.get("/authentication/profile")
		.then((response: AxiosResponse) => {
			return response.data as ProfileDetailsFromJwt;
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default getProfileFromJwt;
