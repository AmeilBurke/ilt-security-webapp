import { Text } from "@chakra-ui/react";
import type { Staff } from "@/utils/interfaces";

const PageStaff = ({ staff }: { staff: Staff[] }) => {
	return (
		<>
			{staff.map((person) => {
				return (
					<Text key={person.id}>
						{person.id} : {person.name}
					</Text>
				);
			})}
		</>
	);
};

export default PageStaff;
