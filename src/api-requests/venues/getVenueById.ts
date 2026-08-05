import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getVenueById = async (venueId: string): Promise<Venue | AxiosError | ApiRequestError> => {
  return await axiosInstance
    .get(`/venues/${venueId}`)
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

export default getVenueById;
