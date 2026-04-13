import type { RegisteredRouter } from "@tanstack/react-router";
import { type AxiosError, type AxiosResponse, isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { ApiRequestError } from "./interfaces";
import { isApiRequestError } from "./isApiRequestError";

export const capitalizeString = (textToCapitilize: string) => {
	return textToCapitilize.replace(
		textToCapitilize.charAt(0),
		textToCapitilize.charAt(0).toUpperCase(),
	);
};

export const handleApiResult = <T extends object>(
	result: AxiosResponse<T> | AxiosError | ApiRequestError,
	router: RegisteredRouter,
): result is AxiosResponse<T> => {
	if (isApiRequestError(result)) {
		toast.error(
			`Failed to create an admin account because:\n - ${capitalizeString(result.message.join("\n - "))}`,
		);
		return false;
	}
	if (isAxiosError(result)) {
		router.navigate({ to: "/error" });
		return false;
	}
	return true;
};
