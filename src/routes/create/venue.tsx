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
import PageCreate from "@/components/pages/PageCreate";
import { capitalizeString } from "@/utils";
import type { IsSetupDone } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";
import createVenueImage from "../../assets/create-venue.png";

export const Route = createFileRoute("/create/venue")({
	beforeLoad: async () => {
		const result = await isSetupDone();

		if (isAxiosError(result)) {
			throw redirect({ to: "/error", search: { error: result.message } });
		}

		if (isApiRequestError(result)) {
			throw redirect({ to: "/error", search: { error: capitalizeString(result.error) } });
		}

		const data = result as IsSetupDone;

		if (!data.isInitialAdminCreated) {
			throw redirect({ to: "/create/admin" });
		}

		return data as IsSetupDone;
	},
	loader: ({ context }) => {
		return context.isInitialVenueCreated;
	},

	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const isInitialVenueCreated = Route.useLoaderData()

	const [venueImage, setVenueImage] = useState<File | undefined>(undefined);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);

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
		try {
			const result = await createNewVenue(createVenueDto);

			if (isApiRequestError(result)) {
				toast.error(
					`Failed to create venue because:\n - ${capitalizeString(result.message.join("\n"))}`,
				);
				return;
			}

			if (isAxiosError(result)) {
				router.navigate({ to: "/error", search: { error: result.message } });
				return;
			}

			toast.success(`${result.data.name} was created`);
			router.navigate({ to: "/" });
		} catch (error) {
			router.navigate({
				to: "/error",
				search: {
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
				},
			});
		} finally {
			setLoading(false);
		}
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
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter name of venue"
					variant="flushed"
				/>
			</Field.Root>

			<Field.Root required>
				<Field.Label>
					Address <Field.RequiredIndicator />
				</Field.Label>
				<Input
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Enter address of venue"
					variant="flushed"
				/>
			</Field.Root>

			<Field.Root required>
				<Field.Label>
					Phone <Field.RequiredIndicator />
				</Field.Label>
				<Input
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
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
			Create Venue
		</Button>
	);

	return (
		<PageCreate
			heading="Create Venue"
			subText="Fill out the details below to create a venue"
			inputs={inputs}
			button={button}
			imagePath={!isInitialVenueCreated ? createVenueImage : undefined}
		/>
	);
}