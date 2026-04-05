import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/utils/axiosInstance";

const isSetupDone = async () => {
    return axiosInstance
        .get("/staff/setup")
        .then((response: AxiosResponse) => {
            return response;
        })
        .catch((error: AxiosError) => {
            return error;
        });
};

export default isSetupDone;
