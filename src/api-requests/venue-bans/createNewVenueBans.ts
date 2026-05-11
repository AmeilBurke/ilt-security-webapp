import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BanWithVenueBans, CreateVenueBansDto } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewVenueBans = async (createBanDto: CreateVenueBansDto): Promise<BanWithVenueBans | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .post("/venue-Bans", createBanDto)
        .then((response: AxiosResponse) => {
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
                } as ApiRequestError
            }

            return error;
        });
};

export default createNewVenueBans;
