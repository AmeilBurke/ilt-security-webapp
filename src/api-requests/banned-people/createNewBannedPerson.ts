import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewBannedPerson = async (createBannedPersonDto: FormData) => {
    return await axiosInstance
        .post("/banned-people", createBannedPersonDto)
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

export default createNewBannedPerson;
