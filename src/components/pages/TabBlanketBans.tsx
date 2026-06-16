import {
	Box,
	Button,
	type DateValue,
	Field,
	HStack,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import updateBanById from "@/api-requests/ban/updateBanById";
import { isErrorCheck } from "@/utils";
import type { UpdateBanDto } from "@/utils/dtos";
import { Role } from "@/utils/enums";
import type {
	Ban,
	BannedPerson,
	Venue,
	VenueSelection,
} from "@/utils/interfaces";
import BannedPersonCard from "../ui/BannedPersonCard";
import ComponentBanDetails from "../ui/BlanketBan/BanDetails";
import BanEditDetails from "../ui/BlanketBan/BanEditDetails";
import ComponentDialog from "../ui/ComponentDialog";
import ComponentGrid from "../ui/ComponentGrid";

export type TabBlanketBansProps = {
	blanketBans: BannedPerson[];
	userRole: Role;
	venues: Venue[];
};

const computeVenueSelections = (
	ban: Ban,
	venues: Venue[],
): VenueSelection[] => {
	if (!ban.venueBans) {
		return [];
	}

	const bannedVenueIds = new Set(
		ban.venueBans.map((venueBan) => venueBan.venueId),
	);

	return venues.map((venue) => {
		return {
			label: venue.name,
			checked: bannedVenueIds.has(venue.id),
			value: venue.id,
		};
	});
};

const TabBlanketBans = ({
	blanketBans,
	userRole,
	venues,
}: TabBlanketBansProps) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>("");
	const [blanketBansFiltered, setBlanketBansFiltered] =
		useState<BannedPerson[]>(blanketBans);

	const [isCreateBanDialogOpen, setIsCreateBanDialogOpen] =
		useState<boolean>(false);
	const [isBanDetailsDialogOpen, setIsBanDetailsDialogOpen] =
		useState<boolean>(false);
	const [isEditBanDetailDialogOpen, setIsEditBanDetailDialogOpen] =
		useState<boolean>(false);

	const [selectedPerson, setSelectedPerson] = useState<
		BannedPerson | undefined
	>(undefined);
	const [selectedBan, setSelectedBan] = useState<Ban | undefined>(undefined);

	const [venueSelectionValues, setVenueSelectionValues] = useState<
		VenueSelection[]
	>([]);
	// const [originalVenueSelectionValues, setOriginalVenueSelectionValues] = useState<VenueSelection[]>([]);

	const [reason, setReason] = useState<string>("");
	const [notes, setNotes] = useState<string>("");
	const [endDate, setEndDate] = useState<DateValue[]>([]);

	const allChecked = venueSelectionValues.every((v) => v.checked);
	const indeterminate =
		venueSelectionValues.some((v) => v.checked) && !allChecked;

	// For filtering search results
	useEffect(() => {
		if (searchValue === "") {
			setBlanketBansFiltered(blanketBans);
		} else {
			setBlanketBansFiltered(
				blanketBans.filter((person) =>
					person.name
						.toLowerCase()
						.trim()
						.includes(searchValue.toLowerCase().trim()),
				),
			);
		}
	}, [blanketBans, searchValue]);

	const handleOpenCreateBan = () => {
		if (blanketBans.length !== 0) {
			setIsCreateBanDialogOpen(true);
			return;
		}
		router.navigate({ to: "/create/bannedPerson" });
	};

	const handleEditBanDetailUpdate = async () => {
		if (!selectedBan) {
			return;
		}

		const venueIdsToBanFrom = venueSelectionValues
			.filter((venue) => {
				return venue.checked;
			})
			.map((value) => {
				return value.value;
			});

		const updateBanDto: UpdateBanDto = {
			reason: reason || selectedBan?.reason,
			notes: notes || selectedBan?.notes,
			endDate:
				endDate.length !== 0
					? dayjs(
						`${endDate[0].year} / ${endDate[0].month}/${endDate[0].day}`,
					).toISOString()
					: undefined,
			isBlanketBan: allChecked,
			venueIds: venueIdsToBanFrom,
		};

		const result = await updateBanById(selectedBan.id, updateBanDto);

		if (isErrorCheck(result)) {
			toast.error("Could not approve pending ban, try again later");
			return;
		}

		toast.success("Ban updated successfully");
		handleEditBanDetailDialogClose();
		setIsBanDetailsDialogOpen(false);
		router.invalidate();
	};

	const handleBanDetailsDialogOpen = (selectedPerson: BannedPerson) => {
		setIsBanDetailsDialogOpen(true);
		setSelectedPerson(selectedPerson);
	};

	const handleEditBanDetailDialogOpen = (selectedBan: Ban) => {
		setIsEditBanDetailDialogOpen(true);
		setSelectedBan(selectedBan);
		setVenueSelectionValues(computeVenueSelections(selectedBan, venues));
		// need to figure out what this was for

		// setOriginalVenueSelectionValues(
		// 	computeVenueSelections(selectedBan, venues),
		// );
	};

	const handleEditBanDetailDialogClose = () => {
		setIsEditBanDetailDialogOpen(false);
		setSelectedBan(undefined);
	};

	return (
		<VStack gap={8}>
			<VStack w="full">
				<Button w="full" onClick={handleOpenCreateBan}>
					Create A New Ban
				</Button>
				<ComponentDialog
					isOpen={isCreateBanDialogOpen}
					onCloseDialog={() => setIsCreateBanDialogOpen(false)}
					title="Create Ban"
					body={<Text>Is this ban for someone with a previous ban?</Text>}
					footer={
						<>
							<Button asChild variant="outline">
								<Link to="/create/bannedPerson">No</Link>
							</Button>
							<Button asChild variant="outline">
								<Link to="/create/ban">Yes</Link>
							</Button>
						</>
					}
				/>
			</VStack>

			{
				blanketBansFiltered.length > 0 && (
					<Field.Root required>
						<Field.Label>Search Through Bans Here</Field.Label>
						<Input
							value={searchValue}
							onChange={(event) => setSearchValue(event.target.value)}
							placeholder="Search Bans Here"
							variant="flushed"
						/>
					</Field.Root>
				)
			}

			<ComponentGrid>
				{blanketBansFiltered.length === 0 ? (
					<Text>No Matches Found.</Text>
				) : (
					blanketBansFiltered.map((person) => {
						return (
							<Box
								key={person.id}
								onClick={() => handleBanDetailsDialogOpen(person)}
								cursor="pointer"
							>
								<BannedPersonCard key={person.id} person={person} />
							</Box>
						);
					})
				)}
			</ComponentGrid>

			{/* Ban Details Dialog */}
			<ComponentDialog
				isOpen={isBanDetailsDialogOpen}
				onCloseDialog={() => setIsBanDetailsDialogOpen(false)}
				title={selectedPerson?.name || ""}
				body={
					<ComponentBanDetails
						bans={selectedPerson?.bans}
						userRole={userRole}
						onHandleEditBanDetailDialogOpen={handleEditBanDetailDialogOpen}
					/>
				}
				onCloseFinish={() => setSelectedPerson(undefined)}
			/>

			{/* Edit Ban Details dialog */}
			{userRole === Role.ADMIN && (
				<ComponentDialog
					isOpen={isEditBanDetailDialogOpen}
					onCloseDialog={handleEditBanDetailDialogClose}
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
							<Button
								variant="outline"
								onClick={handleEditBanDetailDialogClose}
							>
								Cancel
							</Button>
							<Button onClick={handleEditBanDetailUpdate}>Update Ban</Button>
						</HStack>
					}
				/>
			)}
		</VStack>
	);
};

export default TabBlanketBans;
