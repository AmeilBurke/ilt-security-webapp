import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { Alert, ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewAlert = async (createAlertDto: FormData): Promise<Alert> => {
    return axiosInstance
        .post("/alerts", createAlertDto)
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

export default createNewAlert