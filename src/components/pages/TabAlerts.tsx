import {
	Button,
	CloseButton,
	Dialog,
	HStack,
	IconButton,
	Image,
	Menu,
	Portal,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiMenuKebab } from "react-icons/ci";
import deleteAlertById from "@/api-requests/alerts/deleteAlertById";
import getAllAlerts from "@/api-requests/alerts/getAllAlerts";
import { capitalizeString } from "@/utils";
import type { Alert } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const TabAlerts = ({ alerts }: { alerts: Alert[] }) => {
	const [selectedAlertId, setSelectedAlertId] = useState<string>("");
	const router = useRouter();

	const deleteAlertHandler = async (alertId: string) => {
		const deleteResult = await deleteAlertById(alertId);

		if (isApiRequestError(deleteResult) || isAxiosError(deleteResult)) {
			toast.error("Could not delete alert, try again later");
			return;
		}

		setSelectedAlertId("");
		toast.success("Alert successfully deleted");

		const getAllAlertsResult = await getAllAlerts();

		if (isApiRequestError(getAllAlertsResult) || isAxiosError(getAllAlertsResult)) {
			toast.error("Could not get updated alerts, try again later");
			return;
		}

		await router.invalidate();
	};

	return (
		<VStack w="full" gap={4}>
			<Button w="full" onClick={() => router.navigate({ to: "/create/alert" })}>
				Create New Alert
			</Button>

			{alerts.length === 0 ? (
				<Text w="full">No alerts have been uploaded</Text>
			) : (
				<SimpleGrid w="full" columns={{ base: 2, lg: 4 }} gap={8}>
					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								w="full"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack w="full" alignItems="flex-start" gap={1}>
								<HStack w="full" justifyContent={"space-between"}>
									<Text>{capitalizeString(alert.reason)}</Text>
									<Menu.Root>
										<Menu.Trigger asChild>
											<IconButton variant="ghost">
												<CiMenuKebab />
											</IconButton>
										</Menu.Trigger>
										<Portal>
											<Menu.Positioner>
												<Menu.Content>
													<Menu.Item value="delete">
														<Menu.Item
															value="delete"
															onClick={() => setSelectedAlertId(alert.id)}
														>
															Delete...
														</Menu.Item>
													</Menu.Item>
												</Menu.Content>
											</Menu.Positioner>
										</Portal>
									</Menu.Root>
								</HStack>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm a")}
								</Text>
							</VStack>
						</VStack>
					))}
				</SimpleGrid>
			)}

			<Dialog.Root
				size="xl"
				placement="center"
				role="alertdialog"
				closeOnInteractOutside={true}
				open={selectedAlertId !== ""}
				onOpenChange={(e) => {
					if (!e.open) {
						setSelectedAlertId("");
					}
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.CloseTrigger asChild>
								<CloseButton />
							</Dialog.CloseTrigger>
							<Dialog.Header>
								<Dialog.Title>Confirm Delete</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text>
									Are you sure you want to delete this item? This action cannot
									be undone.
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button
									variant="outline"
									onClick={() => setSelectedAlertId("")}
								>
									Cancel
								</Button>
								<Button
									onClick={() => deleteAlertHandler(selectedAlertId)}
									colorPalette="red"
								>
									Delete
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</VStack>
	);
};

export default TabAlerts;
