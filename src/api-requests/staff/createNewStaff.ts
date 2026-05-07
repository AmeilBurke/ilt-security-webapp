import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiRequestError, CreateStaffDto, Staff, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const createNewStaff = async (createStaffDto: CreateStaffDto): Promise<string | AxiosError | ApiRequestError> => {
	return await axiosInstance
		.post("/staff", {
			email: createStaffDto.email,
			name: createStaffDto.name,
			password: createStaffDto.password,
			role: createStaffDto.role,
			venueManagerAssignments: createStaffDto.venueManagerAssignments,
			dutyManagerAssignments: createStaffDto.dutyManagerAssignments,
		})
		.then((response: AxiosResponse) => {
			return response.data as string;
		})
		.catch((error: AxiosError) => {
			if (isApiRequestError(error.response?.data)) {
				return error.response?.data as ApiRequestError;
			}

			return error;
		});
};

export default createNewStaff;
