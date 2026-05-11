import { Text, VStack } from "@chakra-ui/react";
import type { BannedPerson, PendingBan, Venue } from "@/utils/interfaces";
import CardPendingBan from "../ui/CardPendingBan";
import ComponentGrid from "../ui/ComponentGrid";

export type TabPendingBansProps = {
	pendingBans: PendingBan[],
	venues: Venue[],
	allBanned: BannedPerson[]
}
const TabPendingBans = ({ pendingBans, venues, allBanned }: TabPendingBansProps) => {

	const validBans = pendingBans.filter(ban => allBanned.some(person => person.id === ban.personId));

	if (pendingBans.length === 0 || validBans.length === 0) {
		return <Text>No current pending bans</Text>
	}


	return (
		<VStack w="full" gap={4}>
			<ComponentGrid>
				{
					validBans.map(ban => {
						return (
							<CardPendingBan
								key={ban.id}
								ban={ban}
								venues={venues}
								allBanned={allBanned}
							/>
						)
					})
				}

			</ComponentGrid>
		</VStack>
	);
};

export default TabPendingBans;
