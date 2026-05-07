import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BannedPersonWithVenueBans } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllBlanketBannedPeople = async (): Promise<BannedPersonWithVenueBans[] | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.get("/banned-people/blanket-banned")
		.then((response: AxiosResponse) => {
			return response.data as BannedPersonWithVenueBans[];
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}
			return error;
		});
};

export default getAllBlanketBannedPeople;
