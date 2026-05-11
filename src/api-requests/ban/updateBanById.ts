import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BanWithVenueBans, UpdateBanDto } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const updateBanById = async (id: string, updateBanDto: UpdateBanDto): Promise<BanWithVenueBans | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .patch(`/bans/${id}`, updateBanDto)
        .then((response: AxiosResponse) => {
            return response.data as BanWithVenueBans;
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

export default updateBanById;
