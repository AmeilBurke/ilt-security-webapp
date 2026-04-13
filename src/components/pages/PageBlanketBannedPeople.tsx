import { Text } from "@chakra-ui/react";
import type { BannedPerson } from "@/utils/interfaces";

const PageBlanketBannedPeople = ({
	blanketBanned,
}: {
	blanketBanned: BannedPerson[];
}) => {
	return (
		<>
			{blanketBanned.map((person) => {
				return (
					<Text key={person.id}>
						{person.id} : {person.name}
					</Text>
				);
			})}
		</>
	);
};

export default PageBlanketBannedPeople;
