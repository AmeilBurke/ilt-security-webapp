import { Box, Button, type DateValue, HStack, Text } from "@chakra-ui/react";
import type { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
    areAllVenueSelectionValuesChecked,
    areAllVenueSelectionValuesIndeterminate,
    convertVenuesToVenueSelectionValues,
    handleEditBanDetailUpdate,
} from "@/utils";
import { Role } from "@/utils/enums";
import type {
    Ban,
    BannedPerson,
    DialogMode,
    Venue,
    VenueSelection,
} from "@/utils/interfaces";
import BannedPersonCard from "../BannedPersonCard";
import ComponentBanDetails from "../BlanketBan/BanDetails";
import BanEditDetails from "../BlanketBan/BanEditDetails";
import ComponentDialog from "../ComponentDialog";
import ComponentGrid from "../ComponentGrid";

export type GridOfBannedPeopleWithBanDetailsProps = {
    bansFiltered: BannedPerson[];
    onSetDialogMode: (value: DialogMode) => void;
    venues: Venue[];
    dialogMode: DialogMode;
    userRole: Role;
    router: ReturnType<typeof useRouter>;
};

const GridOfBannedPeopleWithBanDetails = ({
    bansFiltered,
    onSetDialogMode,
    venues,
    dialogMode,
    userRole,
    router
}: GridOfBannedPeopleWithBanDetailsProps) => {
    const [selectedPersonId, setSelectedPersonId] = useState<
        BannedPerson["id"] | undefined
    >(undefined);
    const [selectedBanId, setSelectedBanId] = useState<Ban["id"] | undefined>(
        undefined,
    );

    const [venueSelectionValues, setVenueSelectionValues] = useState<
        VenueSelection[]
    >([]);

    const [reason, setReason] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [endDate, setEndDate] = useState<DateValue[]>([]);

    const selectedPerson = bansFiltered.find(
        (person) => person.id === selectedPersonId,
    );
    const selectedBan = selectedPerson?.bans?.find(
        (ban) => ban.id === selectedBanId,
    );

    const allChecked = areAllVenueSelectionValuesChecked(venueSelectionValues);
    const indeterminate = areAllVenueSelectionValuesIndeterminate(
        venueSelectionValues,
        allChecked,
    );

    // --- Ban Details dialog ---
    const handleOpenBanDetails = (person: BannedPerson) => {
        setSelectedPersonId(person.id);
        onSetDialogMode("details");
    };

    const handleCloseBanDetails = () => onSetDialogMode("none");
    const handleCleanupBanDetails = () => setSelectedPersonId(undefined);

    // --- Edit Ban Detail dialog ---
    const handleOpenEditBanDetail = (ban: Ban) => {
        setSelectedBanId(ban.id);
        setVenueSelectionValues(convertVenuesToVenueSelectionValues(ban, venues));
        onSetDialogMode("edit");
    };

    const handleCloseEditBanDetail = () => onSetDialogMode("details");
    const handleCleanupEditBanDetail = () => {
        setSelectedBanId(undefined);
        setReason("");
        setNotes("");
        setEndDate([]);
        setVenueSelectionValues([]);
    };

    return (
        <>
            <ComponentGrid>
                {bansFiltered.length === 0 ? (
                    <Text>No Matches Found.</Text>
                ) : (
                    bansFiltered.map((person) => {
                        return (
                            <Box
                                key={person.id}
                                onClick={() => handleOpenBanDetails(person)}
                                cursor="pointer"
                            >
                                <BannedPersonCard key={person.id} person={person} />
                            </Box>
                        );
                    })
                )}
            </ComponentGrid>
            <ComponentDialog
                isOpen={dialogMode === "details" || dialogMode === "edit"}
                onCloseDialog={handleCloseBanDetails}
                onCloseFinish={handleCleanupBanDetails}
                title={selectedPerson?.name || ""}
                body={
                    <ComponentBanDetails
                        bans={selectedPerson?.bans}
                        userRole={userRole}
                        onHandleEditBanDetailDialogOpen={handleOpenEditBanDetail}
                    />
                }
            />
            ;{/* Edit Ban Details dialog */}
            {userRole === Role.ADMIN && (
                <ComponentDialog
                    isOpen={dialogMode === "edit"}
                    onCloseDialog={handleCloseEditBanDetail}
                    onCloseFinish={handleCleanupEditBanDetail}
                    title={`Edit Ban Details`}
                    body={
                        <BanEditDetails
                            selectedBan={selectedBan}
                            reason={reason}
                            onSetReason={setReason}
                            notes={notes}
                            onSetNotes={setNotes}
                            endDate={endDate}
                            onSetEndDate={setEndDate}
                            allChecked={allChecked}
                            indeterminate={indeterminate}
                            venueSelectionValues={venueSelectionValues}
                            onSetVenueSelectionValues={setVenueSelectionValues}
                        />
                    }
                    footer={
                        <HStack>
                            <Button variant="outline" onClick={handleCloseEditBanDetail}>
                                Cancel
                            </Button>
                            {selectedBan && (
                                <Button
                                    onClick={() =>
                                        handleEditBanDetailUpdate(
                                            selectedBan,
                                            venueSelectionValues,
                                            reason,
                                            endDate,
                                            allChecked,
                                            handleCloseEditBanDetail,
                                            router,
                                            notes,
                                        )
                                    }
                                >
                                    Update Ban
                                </Button>
                            )}
                        </HStack>
                    }
                />
            )}
        </>
    );
};

export default GridOfBannedPeopleWithBanDetails;
