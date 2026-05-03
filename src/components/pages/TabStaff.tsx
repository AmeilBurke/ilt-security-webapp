import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import type { Staff } from "@/utils/interfaces";

const TabStaff = ({ staff }: { staff: Staff[] }) => {
	const router = useRouter();
	return (
		<>
			<Button onClick={() => {router.navigate({to:'/sign-in'})}}>Sign Out</Button>
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

export default TabStaff;
