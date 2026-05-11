import {
	Box,
	type DateValue,
	Dialog,
	parseDate,
	Text
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { BannedPerson, PendingBan, Venue, VenueSelection } from "@/utils/interfaces";
import CardPendingBanTrigger from "./Trigger";
import CardPendingBanTriggerContent from "./TriggerContent";

type CardPendingBanProps = {
	ban: PendingBan;
	venues: Venue[];
	allBanned: BannedPerson[];
};

const CardPendingBan = ({ ban, venues, allBanned }: CardPendingBanProps) => {
	const router = useRouter();

	const [selectedBannedPerson, setSelectedBannedPerson] = useState<BannedPerson>(() => allBanned.find((person) => person.id === ban.personId) as BannedPerson);
	const originalSelectedBannedPerson = allBanned.find((person) => person.id === ban.personId) as BannedPerson;

	const [reason, setReason] = useState(ban.reason);
	const [notes, setNotes] = useState(ban.notes);
	const [endDate, setEndDate] = useState<DateValue[]>([]);
	const [venueSelectionValues, setVenueSelectionValues] = useState<VenueSelection[]>(useMemo(
		() => {
			if (!ban.venueBans) {
				return [];
			}

			const bannedVenueIds = new Set(ban.venueBans.map((vb) => vb.venueId));

			return venues.map((venue) => {
				const existingBan = ban.venueBans?.find((vb) => vb.venueId === venue.id);
				return {
					label: venue.name,
					checked: bannedVenueIds.has(venue.id),
					value: venue.id,
					endDate: existingBan
						? [parseDate(existingBan.endDate.split("T")[0])]
						: ([] as DateValue[]),
				};
			});
		}, [ban.venueBans, venues]
	),);
	const allChecked = venueSelectionValues.every((venue) => venue.checked);
	const noneChecked = venueSelectionValues.every((venue) => !venue.checked);
	const indeterminate = venueSelectionValues.some((venue) => venue.checked) && !allChecked;

	const handleGlobalDateSelect = (date: DateValue[]) => {
		setEndDate(date);
		setVenueSelectionValues(venueSelectionValues.map((venueSelection) => ({ ...venueSelection, endDate: date })));
	};

	const handleVenueDateSelect = (index: number, date: DateValue[]) => {
		setVenueSelectionValues(() =>
			venueSelectionValues.map((value, childIndex) => (childIndex === index ? { ...value, endDate: date } : value)),
		);
	};

	return (
		<Dialog.Root size="cover" placement="center" scrollBehavior="inside">
			<Dialog.Trigger asChild cursor="pointer" >
				<Box>
					<CardPendingBanTrigger
						imagePath={ban.person.imagePath}
						name={ban.person.name}
						createdBy={ban.createdBy.name}
						startDate={ban.startDate}
						reason={ban.reason}
					/>
				</Box>
			</Dialog.Trigger>
			<CardPendingBanTriggerContent
				selectedBannedPerson={selectedBannedPerson}
				originalSelectedBannedPerson={originalSelectedBannedPerson}
				onBannedPersonSelect={setSelectedBannedPerson}
				ban={ban}
				allBanned={allBanned}
				onReasonSelect={setReason}
				onNotesSelect={setNotes}
				endDate={endDate}
				venues={venues}
				venueSelectionValues={venueSelectionValues}
				onVenueSelection={setVenueSelectionValues}
				allChecked={allChecked}
				indeterminate={indeterminate}
				onHandleGlobalDateSelect={handleGlobalDateSelect}
				onHandleVenueDateSelect={handleVenueDateSelect}
			/>
		</Dialog.Root>
	);
};

export default CardPendingBan;
