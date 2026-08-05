import { Button, Field, Input, Text, VStack } from "@chakra-ui/react";
import { Link, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo, useState } from "react";
import type { Role } from "@/utils/enums";
import type { BannedPerson, DialogMode, Venue } from "@/utils/interfaces";
import GridOfBannedPeopleWithBanDetails from "../ui/BannedPerson/GridOfBannedPeopleWithBanDetails";
import ComponentDialog from "../ui/ComponentDialog";

export type TabBlanketBansProps = {
	blanketBans: BannedPerson[];
	userRole: Role;
	venues: Venue[];
};

dayjs.extend(utc);

const TabBlanketBans = ({
	blanketBans,
	userRole,
	venues,
}: TabBlanketBansProps) => {
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>("");
	const blanketBansFiltered = useMemo(() => {
		if (searchValue === "") return blanketBans;
		return blanketBans.filter((person) =>
			person.name
				.toLowerCase()
				.trim()
				.includes(searchValue.toLowerCase().trim()),
		);
	}, [blanketBans, searchValue]);

	const [dialogMode, setDialogMode] = useState<DialogMode>("none");

	// --- Create Ban dialog ---
	const handleOpenCreateBan = () => {
		if (blanketBans.length !== 0) {
			setDialogMode("create");
			return;
		}
		router.navigate({ to: "/create/bannedPerson" });
	};

	return (
		<VStack gap={8}>
			<VStack w="full">
				<Button w="full" onClick={handleOpenCreateBan}>
					Create A New Ban
				</Button>
				<ComponentDialog
					isOpen={dialogMode === "create"}
					onCloseDialog={() => setDialogMode("none")}
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

			{blanketBans.length > 0 && (
				<Field.Root required>
					<Field.Label>Search Through Bans Here</Field.Label>
					<Input
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
						placeholder="Search Bans Here"
						variant="flushed"
					/>
				</Field.Root>
			)}

			<GridOfBannedPeopleWithBanDetails
				bansFiltered={blanketBansFiltered}
				dialogMode={dialogMode}
				onSetDialogMode={(value) => setDialogMode(value)}
				venues={venues}
				userRole={userRole}
				router={router}
			/>
		</VStack>
	);
};

export default TabBlanketBans;
