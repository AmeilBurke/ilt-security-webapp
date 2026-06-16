import {
	Box,
	Button,
	Checkbox,
	CloseButton,
	type DateValue,
	Dialog,
	Field,
	HStack,
	Input,
	Portal,
	parseDate,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import deleteBanById from "@/api-requests/ban/deleteBanById";
import updateBanById from "@/api-requests/ban/updateBanById";
import { isErrorCheck } from "@/utils";
import type { UpdateBanDto } from "@/utils/dtos";
import type {
	Ban,
	BannedPerson,
	DialogMode,
	Venue,
	VenueSelection,
} from "@/utils/interfaces";
import BannedPersonSelector from "../ui/BannedPerson/BannedPersonSelector";
import CalenderInput from "../ui/CalenderInput";
import CardPendingBanTrigger from "../ui/CardPendingBan/PendingBannedPersonCard";
import ComponentGrid from "../ui/ComponentGrid";
import ConfirmDialog from "../ui/ConfirmDialog";

export type TabPendingBansProps = {
	pendingBans: Ban[];
	venues: Venue[];
	allBanned: BannedPerson[];
};

const computeVenueSelections = (
	pendingBan: Ban,
	venues: Venue[],
): VenueSelection[] => {
	const bannedVenueIds = new Set(
		pendingBan.venueBans.map((venueBan) => venueBan.venueId),
	);

	return venues.map((venue) => {
		return {
			label: venue.name,
			checked: bannedVenueIds.has(venue.id),
			value: venue.id
		};
	});
};

const TabPendingBans = ({
	pendingBans,
	venues,
	allBanned,
}: TabPendingBansProps) => {
	const router = useRouter();
	const [selectedPendingBan, setSelectedPendingBan] = useState<Ban | null>(
		null,
	);
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);
	const [selectedBannedPerson, setSelectedBannedPerson] = useState<
		BannedPerson | undefined
	>(undefined);
	const [reason, setReason] = useState("");
	const [notes, setNotes] = useState("");
	const [endDate, setEndDate] = useState<DateValue[]>([]);
	const [venueSelectionValues, setVenueSelectionValues] = useState<
		VenueSelection[]
	>([]);

	const allChecked = venueSelectionValues.every((v) => v.checked);
	const noneChecked = venueSelectionValues.every((v) => !v.checked);
	const indeterminate =
		venueSelectionValues.some((v) => v.checked) && !allChecked;

	const handleGlobalDateSelect = (date: DateValue[]) => {
		setEndDate(date);
		setVenueSelectionValues((prev) =>
			prev.map((v) => ({ ...v, endDate: date })),
		);
	};

	const validBans = pendingBans.filter((ban) =>
		allBanned.some((person) => person.id === ban.personId),
	);

	if (pendingBans.length === 0 || validBans.length === 0) {
		return <Text>No current pending bans</Text>;
	}

	const openDialog = (pendingBan: Ban) => {
		setSelectedPendingBan(pendingBan);
		setSelectedBannedPerson(
			allBanned.find((person) => person.id === pendingBan.personId),
		);
		setVenueSelectionValues(computeVenueSelections(pendingBan, venues));
		setDialogMode("delete");
		setReason(pendingBan.reason);

		if (pendingBan.notes) {
			setNotes(pendingBan.notes);
		}
	};

	const closeDialog = () => {
		setDialogMode(null);
	};

	const handleDeletePendingBan = async (pendingBanId: string) => {
		const deleteResult = await deleteBanById(pendingBanId);

		if (isErrorCheck(deleteResult)) {
			toast.error("Could not delete pending ban, try again later");
			return;
		}

		closeDialog();
		toast.success("Pending ban successfully deleted");
		await router.invalidate();
	};

	const confirmDeleteDialogTrigger = <Button colorPalette="red">Deny</Button>;
	const confirmDeleteDialogBody = (
		<Text>
			Are you sure you want to delete this item? This action cannot be undone.
		</Text>
	);
	const confirmDeleteDialogFooter = (
		<>
			<Button variant="outline" onClick={closeDialog}>
				Cancel
			</Button>
			<Button
				onClick={() =>
					selectedPendingBan?.id
						? handleDeletePendingBan(selectedPendingBan.id)
						: null
				}
				colorPalette="red"
			>
				Delete
			</Button>
		</>
	);

	const handleApprovePendingBan = async (pendingBanId: string) => {

		if (!reason && !selectedPendingBan?.reason) {
			toast.error("Missing reason.");
			return;
		}

		if (endDate.length === 0 && !selectedPendingBan?.endDate) {
			toast.error("Missing end date.");
			return;
		}

		if (
			noneChecked
		) {
			toast.error("Select at least one venue to ban ths person from.");
			return;
		}

		const venueIdsToBanFrom = venueSelectionValues
			.filter((venue) => {
				return venue.checked;
			})
			.map((value) => {
				return value.value;
			});

			console.log(endDate)

		const updateBanDto: UpdateBanDto = {
			personId: selectedBannedPerson?.id,
			reason: reason,
			notes: notes,
			endDate: endDate.length > 0 ? dayjs(`${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`).toISOString() : undefined,
			isBlanketBan: allChecked,
			status: "APPROVED",
			venueIds: venueIdsToBanFrom,
		};

		const approveResult = await updateBanById(pendingBanId, updateBanDto);

		if (isErrorCheck(approveResult)) {
			toast.error("Could not approve pending ban, try again later");
			return;
		}

		closeDialog();
		toast.success("Ban successfully issued");
		await router.invalidate();
	};

	const confirmApproveDialogTrigger = (
		<Button colorPalette="current">Approve</Button>
	);
	const confirmApproveDialogBody = (
		<Text>Press approve again to confirm the ban.</Text>
	);
	const confirmApproveDialogFooter = (
		<>
			<Button variant="outline" onClick={closeDialog}>
				Cancel
			</Button>
			<Button
				onClick={() =>
					selectedPendingBan && handleApprovePendingBan(selectedPendingBan.id)
				}
				colorPalette="current"
			>
				Approve
			</Button>
		</>
	);

	return (
		<VStack w="full" gap={4}>
			<ComponentGrid>
				{validBans.map((ban) => (
					<Box key={ban.id} onClick={() => openDialog(ban)} cursor="pointer">
						{
							ban.person && ban.createdBy && (
								<CardPendingBanTrigger
									imagePath={ban.person.imagePath}
									name={ban.person.name}
									createdBy={ban.createdBy.name}
									startDate={ban.startDate}
									reason={ban.reason}
								/>
							)
						}
					</Box>
				))}
			</ComponentGrid>

			<Dialog.Root
				size="xl"
				placement="center"
				role="alertdialog"
				closeOnInteractOutside
				open={dialogMode !== null}
				onOpenChange={(e) => {
					if (!e.open) closeDialog();
				}}
				onExitComplete={() => setSelectedPendingBan(null)}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.CloseTrigger asChild>
								<CloseButton />
							</Dialog.CloseTrigger>

							<Dialog.Header>
								<Dialog.Title>
									Ban Details For {selectedBannedPerson?.name}
								</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<VStack gap={8}>
									<BannedPersonSelector
										selectedBannedPerson={selectedBannedPerson}
										onBannedPersonSelect={setSelectedBannedPerson}
										allBanned={allBanned}
									/>

									<Field.Root>
										<Field.Label>
											Reason <Field.RequiredIndicator />
										</Field.Label>
										<Input
											onChange={(e) => setReason(e.target.value)}
											placeholder={selectedPendingBan?.reason}
											variant="flushed"
										/>
									</Field.Root>

									<Field.Root>
										<Field.Label>Notes</Field.Label>
										<Input
											onChange={(e) => setNotes(e.target.value)}
											placeholder={
												selectedPendingBan?.notes
													? selectedPendingBan?.notes
													: "Enter extra details here if needed"
											}
											variant="flushed"
										/>
									</Field.Root>

									<CalenderInput
										selectedDate={endDate}
										onDateSelect={handleGlobalDateSelect}
										labelText="Ban End Date"
										placeholder={dayjs(selectedPendingBan?.endDate).format("DD/MM/YYYY")}
									/>

									<Stack w="full" gap={4} align="flex-start">
										<Text fontSize="sm">Ban From:</Text>

										<Checkbox.Root
											checked={indeterminate ? "indeterminate" : allChecked}
											onCheckedChange={(e) =>
												setVenueSelectionValues(
													venueSelectionValues.map((value) => ({
														...value,
														checked: Boolean(e.checked),
													})),
												)
											}
										>
											<Checkbox.HiddenInput />
											<Checkbox.Control>
												<Checkbox.Indicator />
											</Checkbox.Control>
											<HStack w="full" align="center">
												<Checkbox.Label>Blanket Ban?</Checkbox.Label>
											</HStack>
										</Checkbox.Root>

										{venueSelectionValues.map((item, index) => (
											<HStack key={item.value} w="full" align="center" px="10">
												<Checkbox.Root
													checked={item.checked}
													onCheckedChange={(e) =>
														setVenueSelectionValues(
															venueSelectionValues.map((value, childIndex) =>
																childIndex === index
																	? { ...value, checked: Boolean(e.checked) }
																	: value,
															),
														)
													}
													flex={1}
												>
													<Checkbox.HiddenInput />
													<Checkbox.Control />
													<Checkbox.Label textTransform="capitalize">
														{item.label}
													</Checkbox.Label>
												</Checkbox.Root>
											</HStack>
										))}
									</Stack>
								</VStack>
							</Dialog.Body>
							<Dialog.Footer>
								<ConfirmDialog
									trigger={confirmDeleteDialogTrigger}
									title="Deny Ban?"
									body={confirmDeleteDialogBody}
									footer={confirmDeleteDialogFooter}
									size="md"
								/>
								<ConfirmDialog
									trigger={confirmApproveDialogTrigger}
									title="Approve Ban?"
									body={confirmApproveDialogBody}
									footer={confirmApproveDialogFooter}
									size="md"
								/>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</VStack>
	);
};

export default TabPendingBans;
