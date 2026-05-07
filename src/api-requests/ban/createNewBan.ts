import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BanWithVenueBans, CreateBanDto } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewBan = async (createBanDto: CreateBanDto): Promise<BanWithVenueBans | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .post("/bans", createBanDto)
        .then((response: AxiosResponse) => {

            if (response.data === null) {
                return {
                    message: ['No data returned'],
                    error: 'null_response',
                    statusCode: 500
                } as ApiRequestError;
            }
            return response.data;
        })
        .catch((error: AxiosError) => {
            if (isApiRequestError(error.response?.data)) {
                return error.response?.data as ApiRequestError;
            }

            if (!error.response) {
                return {
                    message: ['No data returned'],
                    error: 'unknown',
                    statusCode: 500
                } as ApiRequestError;
            }

            return error;
        });
};

export default createNewBan;
