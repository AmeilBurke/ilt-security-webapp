import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, IsSetupDone } from "@/utils/interfaces";

const isSetupDone = async (): Promise<IsSetupDone | AxiosError | ApiRequestError> => {
	return axiosInstance
		.get("/staff/setup")
		.then((response: AxiosResponse) => {
			return response.data as IsSetupDone;
		})
		.catch((error: AxiosError) => {
			return error;
		});
};

export default isSetupDone;
