import { Button } from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import createNewAlert from "@/api-requests/alerts/createNewAlert";
import getAllBannedPeople from "@/api-requests/banned-people/getAllBannedPeople";
import PageCreate from "@/components/pages/PageCreate";
import BannedPersonSelector from "@/components/ui/ComponentBannedPersonSelector";
import ComponentImageUpload from "@/components/ui/ComponentImageUpload";
import ComponentReasonInput from "@/components/ui/ComponentReasonInput";
import ComponentReturnArrow from "@/components/ui/ComponentReturnArrow";
import ContentContainer from "@/components/ui/ContentContainer";
import { isErrorCheck } from "@/utils";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/alert")({
	component: RouteComponent,
	loader: async () => {
		const allBannedPeople: BannedPerson[] | ApiRequestError | AxiosError =
			await getAllBannedPeople();

		if (isErrorCheck(allBannedPeople)) {
			return [];
		}

		const allBannedPeopleWithoutAlerts = allBannedPeople.filter((person) => {
			return !person.alerts;
		});
		return allBannedPeopleWithoutAlerts as BannedPerson[];
	},
});

function RouteComponent() {
	const router = useRouter();
	const allBannedPeople = Route.useLoaderData();
	const [selectedBannedPerson, setSelectedBannedPerson] = useState<
		BannedPerson | undefined
	>(undefined);
	const [alertImage, setAlertImage] = useState<File>();
	const [reason, setReason] = useState<string>("");
	const [bannedPersonSearch, setBannedPersonSearch] = useState("");

	const uploadAlertHandler = async () => {
		const alertDto = new FormData();

		alertDto.append("reason", reason);

		if (alertImage && !selectedBannedPerson) {
			alertDto.append("image", alertImage);
		}

		if (selectedBannedPerson) {
			alertDto.append("personId", selectedBannedPerson.id);
		}

		const result = await createNewAlert(alertDto);

		if (isApiRequestError(result) || isAxiosError(result)) {
			toast.error("Error");
			console.log(result);
			return;
		}

		toast.success(`Alert created`);

		setBannedPersonSearch("");
		setSelectedBannedPerson(undefined);
		setAlertImage(undefined);
		setReason("");

		router.navigate({ to: "/" });
		return;
	};

	const inputs = (
		<>
			{allBannedPeople.every((person) => {
				return person.alerts;
			}) ? null : (
				<BannedPersonSelector
					bannedPeople={allBannedPeople}
					selectedBannedPerson={selectedBannedPerson}
					onSelectedBannedPerson={setSelectedBannedPerson}
					onSetAlertImage={setAlertImage}
					bannedPersonSearch={bannedPersonSearch}
					labelText="Alert is for someone in system"
					onSetBannedPersonSearch={setBannedPersonSearch}
				/>
			)}

			{selectedBannedPerson !== undefined ? null : (
				<ComponentImageUpload onSetImage={setAlertImage} />
			)}

			<ComponentReasonInput onSetReason={setReason} />
		</>
	);

	const button = (
		<Button
			disabled={
				reason === "" ||
				(selectedBannedPerson === undefined && alertImage === undefined)
			}
			onClick={uploadAlertHandler}
			w="full"
		>
			Upload Alert
		</Button>
	);

	return (
		<ContentContainer>
			<PageCreate
				heading="Create Alert"
				subHeading="Fill out the details below to create an alert"
				inputs={inputs}
				button={button}
				returnArrow={true}
			/>
		</ContentContainer>
	);
}
