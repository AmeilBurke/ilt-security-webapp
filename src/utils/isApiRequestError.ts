import type { ApiRequestError } from "./interfaces";

export const isApiRequestError = (error: unknown): error is ApiRequestError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		"error" in error &&
		"statusCode" in error
	);
};
