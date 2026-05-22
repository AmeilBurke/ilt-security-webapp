import { Box, type DateValue, Dialog, parseDate } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { BannedPerson, PendingBan, Venue, VenueSelection } from "@/utils/interfaces";
import CardPendingBanTrigger from "./Trigger";
import CardPendingBanTriggerContent from "./TriggerContent";

type CardPendingBanProps = {
    ban: PendingBan;
    venues: Venue[];
    allBanned: BannedPerson[];
    onSelectPendingBan: (pendingBan: PendingBan) => void;
};

const CardPendingBan = ({ ban, venues, allBanned }: CardPendingBanProps) => {
    const [selectedBannedPerson, setSelectedBannedPerson] = useState<BannedPerson>(
        () => allBanned.find((person) => person.id === ban.personId) as BannedPerson
    );

    const originalSelectedBannedPerson = useMemo(
        () => allBanned.find((person) => person.id === ban.personId) as BannedPerson,
        [allBanned, ban.personId]
    );

    const [endDate, setEndDate] = useState<DateValue[]>([]);
    const [venueSelectionValues, setVenueSelectionValues] = useState<VenueSelection[]>(() => {
        if (!ban.venueBans) return [];
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
    });

    const allChecked = venueSelectionValues.every((v) => v.checked);
    const indeterminate = venueSelectionValues.some((v) => v.checked) && !allChecked;

    const handleGlobalDateSelect = (date: DateValue[]) => {
        setEndDate(date);
        setVenueSelectionValues((prev) => prev.map((v) => ({ ...v, endDate: date })));
    };

    const handleVenueDateSelect = (index: number, date: DateValue[]) => {
        setVenueSelectionValues((prev) =>
            prev.map((v, i) => (i === index ? { ...v, endDate: date } : v))
        );
    };

    return (
        <Dialog.Root size="cover" placement="center" scrollBehavior="inside">
            <Dialog.Trigger asChild cursor="pointer">
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
                onReasonSelect={() => { }} // wire up if needed
                onNotesSelect={() => { }}  // wire up if needed
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