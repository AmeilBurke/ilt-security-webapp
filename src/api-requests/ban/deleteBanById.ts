import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, Ban } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const deleteBanById = async (banId: string): Promise<Ban | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .delete(`/bans/${banId}`)
        .then((response: AxiosResponse) => {
            return response.data as Ban;
        })
        .catch((error: AxiosError) => {
            if (isApiRequestError(error.response?.data)) {
                return error.response?.data as ApiRequestError;
            }

            return error;
        });
};

export default deleteBanById;
