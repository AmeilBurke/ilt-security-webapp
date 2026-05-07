import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, Staff } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllStaff = async (): Promise<Staff[] | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .get("/staff")
        .then((response: AxiosResponse) => {
            return response.data as Staff[];
        })
        .catch((error: AxiosError) => {
            if (isApiRequestError(error.response?.data)) {
                return error.response?.data as ApiRequestError;
            }

            return error;
        });
};

export default getAllStaff;
