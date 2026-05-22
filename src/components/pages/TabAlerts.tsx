import {
	Button,
	CloseButton,
	Dialog,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import deleteAlertById from "@/api-requests/alerts/deleteAlertById";
import { isErrorCheck } from "@/utils";
import type { Role } from "@/utils/enums";
import type { Alert } from "@/utils/interfaces";
import CardAlert from "../ui/CardAlert";
import ComponentGrid from "../ui/ComponentGrid";

export type TabAlertsProps = {
	alerts: Alert[];
	userRole: Role
};

type DialogMode = "delete" | null;

const TabAlerts = ({ alerts, userRole }: TabAlertsProps) => {
	const router = useRouter();
	const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);

	const openDialog = (alert: Alert) => {
		setSelectedAlertId(alert.id);
		setDialogMode("delete");
	};

	const closeDialog = () => {
		setSelectedAlertId(null);
		setDialogMode(null);
	};

	const handleDeleteAlert = async (alertId: string) => {
		const deleteResult = await deleteAlertById(alertId);

		if (isErrorCheck(deleteResult)) {
			toast.error("Could not delete alert, try again later");
			return;
		}

		closeDialog();
		toast.success("Alert successfully deleted");
		await router.invalidate();
	};

	return (
		<VStack w="full" gap={4}>
			<Button w="full" onClick={() => router.navigate({ to: "/create/alert" })}>
				Create New Alert
			</Button>

			{alerts.length === 0
				? <Text w="full">No alerts have been uploaded</Text>
				: <ComponentGrid>
					{alerts.map((alert) => (
						<CardAlert
							key={alert.id}
							alert={alert}
							onSelectAlert={() => openDialog(alert)}
							userRole={userRole}
						/>
					))}
				</ComponentGrid>
			}

			<Dialog.Root
				size="xl"
				placement="center"
				role="alertdialog"
				closeOnInteractOutside
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
									onClick={() => selectedAlertId ? handleDeleteAlert(selectedAlertId) : null}
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