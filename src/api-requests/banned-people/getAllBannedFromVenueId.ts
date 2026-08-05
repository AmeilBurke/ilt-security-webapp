import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const getAllBannedFromVenueId = async (
  venueId: string,
): Promise<BannedPerson[] | AxiosError | ApiRequestError> => {
  return await axiosInstance
    .get(`/banned-people/venue/${venueId}`)
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

export default getAllBannedFromVenueId;
