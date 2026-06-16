import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { UpdateBanDto } from "@/utils/dtos";
import type { ApiRequestError, Ban } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const updateBanById = async (
	id: string,
	updateBanDto: UpdateBanDto,
): Promise<Ban | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.patch(`/bans/${id}`, updateBanDto)
		.then((response: AxiosResponse) => {
			return response.data as Ban;
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			if (!error.response) {
				return {
					message: ["No data returned"],
					error: "unknown",
					statusCode: 500,
				} as ApiRequestError;
			}

			return error;
		});
};

export default updateBanById;
