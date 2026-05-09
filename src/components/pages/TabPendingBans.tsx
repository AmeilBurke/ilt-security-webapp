import { Text, VStack } from "@chakra-ui/react";
import type { Ban, Venue } from "@/utils/interfaces";
import CardPendingBan from "../ui/CardPendingBan";
import ComponentGrid from "../ui/ComponentGrid";

export type TabPendingBansProps = {
	pendingBans: Ban[],
	venues: Venue[]
}
const TabPendingBans = ({ pendingBans, venues }: TabPendingBansProps) => {

	if (pendingBans.length === 0) {
		return (
			<Text>No current pending bans</Text>
		)
	}

	return (
		<VStack w="full" gap={4}>
			<ComponentGrid>
				{
					pendingBans.map((ban) => {
						return (
							<CardPendingBan
								key={ban.id}
								ban={ban}
								venues={venues}
							/>
						);
					})
				}

			</ComponentGrid>
		</VStack>
	);
};

export default TabPendingBans;
