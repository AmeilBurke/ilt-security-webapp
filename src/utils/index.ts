import { type AxiosError, isAxiosError } from "axios";
import type { ApiRequestError } from "./interfaces";
import { isApiRequestError } from "./isApiRequestError";

export const capitalizeString = (textToCapitalize: string) => {
	return textToCapitalize
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const isErrorCheck = (
	result: unknown,
): result is AxiosError | ApiRequestError => {
	return isAxiosError(result) || isApiRequestError(result);
};