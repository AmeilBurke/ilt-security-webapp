import {
	Button,
	CloseButton,
	Field,
	FileUpload,
	Input,
	InputGroup,
	Text,
} from "@chakra-ui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuFileUp } from "react-icons/lu";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import createNewVenue from "@/api-requests/venues/createNewVenue";
import ComponentInitialSetup from "@/components/pages/ComponentInitialSetup";
import { capitalizeString } from "@/utils";
import type { IsSetupDone } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";
import createVenueImage from "../../assets/create-venue.png";

export const Route = createFileRoute("/initial-setup/create-venue")({
	beforeLoad: async () => {
		const result = await isSetupDone();

		if (isAxiosError(result)) {
			throw redirect({ to: "/error" });
		}

		const data = result.data as IsSetupDone;

		if (!data.isInitialAdminCreated) {
			throw redirect({ to: "/initial-setup/create-admin" });
		}

		if (data.isInitialVenueCreated) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [venueImage, setVenueImage] = useState<File>();
	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const createVenueHandler = async () => {
		if (!venueImage) {
			toast.error("No image was uploaded");
			return;
		}

		const createVenueDto = new FormData();
		createVenueDto.append("image", venueImage);
		createVenueDto.append("name", name);
		createVenueDto.append("address", address);
		createVenueDto.append("phone", phone);

		setLoading(true);

		const result = await createNewVenue(createVenueDto);

		setLoading(false);

		if (isApiRequestError(result)) {
			toast.error(
				`Failed to create an admin account because:\n - ${capitalizeString(result.message.join("\n"))}`,
			);
			return;
		}

		if (isAxiosError(result)) {
			router.navigate({ to: "/error" });
			return;
		}

		toast.success(`${result.data.name} was created`);
		router.navigate({ to: "/" });
		return;
	};

	const inputs = (
		<>
			<FileUpload.Root
				onFileChange={(e) => setVenueImage(e.acceptedFiles[0])}
				gap="1"
			>
				<FileUpload.HiddenInput />
				<FileUpload.Label>Venue Image</FileUpload.Label>
				<InputGroup
					startElement={<LuFileUp />}
					endElement={
						<FileUpload.ClearTrigger asChild>
							<CloseButton
								me="-1"
								size="xs"
								variant="plain"
								focusVisibleRing="inside"
								focusRingWidth="2px"
								pointerEvents="auto"
							/>
						</FileUpload.ClearTrigger>
					}
				>
					<Input asChild>
						<FileUpload.Trigger>
							<FileUpload.Context>
								{({ acceptedFiles }) => (
									<Text lineClamp={1}>
										{acceptedFiles.length > 0
											? acceptedFiles[0].name
											: "Upload image of venue"}
									</Text>
								)}
							</FileUpload.Context>
						</FileUpload.Trigger>
					</Input>
				</InputGroup>
			</FileUpload.Root>

			<Field.Root required>
				<Field.Label>
					Name <Field.RequiredIndicator />
				</Field.Label>
				<Input
					onChange={(event) => setName(event.target.value)}
					placeholder="Enter name of venue"
					variant="flushed"
				/>
			</Field.Root>

			<Field.Root required>
				<Field.Label>
					Address <Field.RequiredIndicator />
				</Field.Label>
				<Input
					onChange={(event) => setAddress(event.target.value)}
					placeholder="Enter name of venue"
					variant="flushed"
				/>
			</Field.Root>

			<Field.Root required>
				<Field.Label>
					Phone <Field.RequiredIndicator />
				</Field.Label>
				<Input
					onChange={(event) => setPhone(event.target.value)}
					placeholder="Enter phone # of venue"
					variant="flushed"
				/>
			</Field.Root>
		</>
	);

	const button = (
		<Button
			disabled={
				venueImage === undefined ||
				name === "" ||
				address === "" ||
				phone === ""
			}
			onClick={createVenueHandler}
			loading={loading}
		>
			Create Account
		</Button>
	);

	return (
		<ComponentInitialSetup
			heading="Create Venue"
			subText="Fill out the details below to create a venue"
			inputs={inputs}
			button={button}
			imagePath={createVenueImage}
		/>
	);
}
