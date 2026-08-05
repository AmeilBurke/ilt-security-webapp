import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllVenues = async (): Promise<Venue[] | ApiRequestError | AxiosError> => {
  return await axiosInstance
    .get("/venues")
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

export default getAllVenues;
