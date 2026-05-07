import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BannedPersonWithVenueBans } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

// need to finish adding return types to api requests then fixing result = await on each page to use new error handling & response.data as type
const createNewBannedPerson = async (createBannedPersonDto: FormData): Promise<BannedPersonWithVenueBans | AxiosError | ApiRequestError> => {
    return await axiosInstance
        .post("/banned-people", createBannedPersonDto)
        .then((response: AxiosResponse) => {
            return response.data as BannedPersonWithVenueBans;
        })
        .catch((error: AxiosError) => {
            if (isApiRequestError(error.response?.data)) {
                return error.response?.data as ApiRequestError;
            }

            return error;
        });
};

export default createNewBannedPerson;
