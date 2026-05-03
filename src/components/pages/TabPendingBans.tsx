import { Text } from "@chakra-ui/react";
import type { BannedPerson } from "@/utils/interfaces";

const TabPendingBans = ({ pendingBans }: { pendingBans: BannedPerson[] }) => {
	return (
		<>
			{pendingBans.map((person) => {
				return (
					<Text key={person.id}>
						{person.id} : {person.name}
					</Text>
				);
			})}
		</>
	);
};

export default TabPendingBans;
