import type { RegisteredRouter } from "@tanstack/react-router";
import { type AxiosError, type AxiosResponse, isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { ApiRequestError } from "./interfaces";
import { isApiRequestError } from "./isApiRequestError";

export const capitalizeString = (textToCapitalize: string) => {
	return textToCapitalize
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const handleApiResult = <T extends object>(
	result: AxiosResponse<T> | AxiosError | ApiRequestError,
	router: RegisteredRouter,
): result is AxiosResponse<T> => {
	if (isApiRequestError(result)) {
		toast.error(result.error);
		router.navigate({ to: "/error", search: { error: result } });
		return false;
	}
	if (isAxiosError(result)) {
		router.navigate({ to: "/error", search: { error: result } });
		return false;
	}
	return true;
};
