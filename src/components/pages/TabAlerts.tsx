import {
	Button,
	CloseButton,
	Dialog,
	Portal,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import deleteAlertById from "@/api-requests/alerts/deleteAlertById";
import getAllAlerts from "@/api-requests/alerts/getAllAlerts";
import { isErrorCheck } from "@/utils";
import type { Role } from "@/utils/enums";
import type { Alert } from "@/utils/interfaces";
import CardAlert from "../ui/CardAlert";

export type TabAlertsProps = { alerts: Alert[]; userRole: Role };
type DialogMode = "delete" | "edit" | null;

const TabAlerts = ({ alerts, userRole }: TabAlertsProps) => {
	const router = useRouter();
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);

	const openDialog = (alert: Alert, mode: DialogMode) => {
		setSelectedAlert(alert);
		setDialogMode(mode);
	};

	const closeDialog = () => {
		setSelectedAlert(null);
		setDialogMode(null);
	};

	const deleteAlertHandler = async (alert: Alert) => {
		const deleteResult = await deleteAlertById(alert.id);

		if (isErrorCheck(deleteResult)) {
			toast.error("Could not delete alert, try again later");
			return;
		}

		closeDialog();
		toast.success("Alert successfully deleted");

		const getAllAlertsResult = await getAllAlerts();

		if (isErrorCheck(getAllAlertsResult)) {
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
						<CardAlert
							key={alert.id}
							alert={alert}
							onSelectAlert={() => openDialog(alert, "delete")}
							userRole={userRole}
						/>
					))}
				</SimpleGrid>
			)}

			<Dialog.Root
				size="xl"
				placement="center"
				role="alertdialog"
				closeOnInteractOutside={true}
				open={dialogMode !== null}
				onOpenChange={(e) => {
					if (!e.open) closeDialog();
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
									Are you sure you want to delete this item? This action
									cannot be undone.
								</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Button variant="outline" onClick={closeDialog}>
									Cancel
								</Button>
								<Button
									onClick={() => selectedAlert ? deleteAlertHandler(selectedAlert) : null}
									colorPalette="red"
								>
									Delete
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</VStack >
	);
};

export default TabAlerts;