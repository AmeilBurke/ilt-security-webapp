import { Button, Text, VStack } from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/error/")({
	validateSearch: (search) => ({
		error: search.error,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { error } = Route.useSearch();
	const router = useRouter()
	let errorMessage = "";

	if (isApiRequestError(error)) {
		errorMessage = String(error.message);
	}

	if (isAxiosError(error)) {
		errorMessage = error.message;
	}

	return (
		<VStack w="full" h="100svh" gap={8} justifyContent='center' >
			<Text textStyle='title' mb={0} textAlign='center'>Error</Text>
			<Text>{errorMessage}</Text>
			<Button onClick={() => { router.navigate({ to: '/' }) }} >Go Back</Button>
		</VStack>
	);
}
