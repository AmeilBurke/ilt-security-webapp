import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllBlanketBannedPeople = async (): Promise<
  BannedPerson[] | AxiosError | ApiRequestError
> => {
  return await axiosInstance
    .get("/banned-people/blanket-banned")
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

export default getAllBlanketBannedPeople;
