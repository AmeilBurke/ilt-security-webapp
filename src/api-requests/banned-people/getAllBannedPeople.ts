import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllBannedPeople = async (): Promise<BannedPerson[] | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.get("/banned-people")
		.then((response: AxiosResponse) => {
			return response.data as BannedPerson[];
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}
			return error;
		});
};

export default getAllBannedPeople;
