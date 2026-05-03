import { Text } from "@chakra-ui/react";
import type { BannedPerson } from "@/utils/interfaces";

const TabBlanketBans = ({
	blanketBans,
}: {
	blanketBans: BannedPerson[];
}) => {
	return (
		<>
			{blanketBans.map((person) => {
				return (
					<Text key={person.id}>
						{person.id} : {person.name}
					</Text>
				);
			})}
		</>
	);
};

export default TabBlanketBans;
