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
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import type {
	BannedPerson,
	PendingBan,
	Venue,
	VenueSelection,
} from "@/utils/interfaces";
import BannedPersonSelector from "../BannedPerson/BannedPersonSelector";
import CalenderInput from "../CalenderInput";
import ConfirmDeny from "./ConfirmDeny";

type CardPendingBanTriggerProps = {
	selectedBannedPerson: BannedPerson;
	originalSelectedBannedPerson: BannedPerson;
	onBannedPersonSelect: (bannedPerson: BannedPerson) => void;
	ban: PendingBan;
	allBanned: BannedPerson[];
	onReasonSelect: (text: string) => void;
	onNotesSelect: (text: string) => void;
	endDate: DateValue[];
	venues: Venue[];
	venueSelectionValues: VenueSelection[];
	onVenueSelection: (venueSelection: VenueSelection[]) => void;
	allChecked: boolean;
	indeterminate: boolean;
	onHandleGlobalDateSelect: (dateValue: DateValue[]) => void;
	onHandleVenueDateSelect: (index: number, dateValue: DateValue[]) => void;
};

const CardPendingBanTriggerContent = ({
	selectedBannedPerson,
	originalSelectedBannedPerson,
	onBannedPersonSelect,
	ban,
	allBanned,
	onReasonSelect,
	onNotesSelect,
	endDate,
	venues,
	venueSelectionValues,
	onVenueSelection,
	allChecked,
	indeterminate,
	onHandleGlobalDateSelect,
	onHandleVenueDateSelect,
}: CardPendingBanTriggerProps) => {
	return (
		<Portal>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>
							Pending Ban Details For: {selectedBannedPerson.name}
							<Text textStyle="muted" fontSize="sm" fontWeight="normal">
								Edit any details by clicking on them
							</Text>
						</Dialog.Title>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Header>
					<Dialog.Body>
						<VStack gap={8}>
							<BannedPersonSelector
								selectedBannedPerson={selectedBannedPerson}
								originalSelectedBannedPerson={originalSelectedBannedPerson}
								onBannedPersonSelect={onBannedPersonSelect}
								allBanned={allBanned}
							/>

							<Field.Root>
								<Field.Label>
									Reason <Field.RequiredIndicator />
								</Field.Label>
								<Input
									onChange={(e) => onReasonSelect(e.target.value)}
									placeholder={ban.reason}
									variant="flushed"
								/>
							</Field.Root>

							<Field.Root>
								<Field.Label>Notes</Field.Label>
								<Input
									onChange={(e) => onNotesSelect(e.target.value)}
									placeholder={
										ban.notes ? ban.notes : "Enter extra details here if needed"
									}
									variant="flushed"
								/>
							</Field.Root>

							<CalenderInput
								selectedDate={endDate}
								onDateSelect={onHandleGlobalDateSelect}
								labelText="Ban End Date"
								helperText="Entering a date here will apply it to all selected venues"
							/>

							<Stack w="full" gap={4} align="flex-start">
								<Text fontSize="sm">Ban From:</Text>

								<Checkbox.Root
									checked={indeterminate ? "indeterminate" : allChecked}
									onCheckedChange={(e) => {
										onVenueSelection(
											venueSelectionValues.map((value) => ({
												...value,
												checked: Boolean(e.checked),
											})),
										);
									}}
								>
									<Checkbox.HiddenInput />
									<Checkbox.Control>
										<Checkbox.Indicator />
									</Checkbox.Control>
									<HStack w="full" align="center">
										<Checkbox.Label>Blanket Ban?</Checkbox.Label>
									</HStack>
								</Checkbox.Root>

								{venueSelectionValues.map((item, index) => {
									return (
										<HStack key={item.value} w="full" align="center" px="10">
											<Checkbox.Root
												checked={item.checked}
												onCheckedChange={(e) =>
													onVenueSelection(
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

											<Box flex={1} textTransform="capitalize">
												<CalenderInput
													selectedDate={item.endDate}
													onDateSelect={(date) =>
														onHandleVenueDateSelect(index, date)
													}
													labelText=""
													helperText={`Entering a date here will apply it to only ${item.label}`}
													isDisabled={!item.checked}
												/>
											</Box>
										</HStack>
									);
								})}
							</Stack>
						</VStack>
					</Dialog.Body>
					<Dialog.Footer>
						<ConfirmDeny banId={ban.id}>
							<Button colorPalette="red">Deny</Button>
						</ConfirmDeny>
						<Button colorPalette="current">Approve</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	);
};

export default CardPendingBanTriggerContent;
