import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, CreateBanDto } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewBan = async (createBanDto: CreateBanDto) => {
    return await axiosInstance
        .post("/bans", createBanDto)
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

export default createNewBan;
