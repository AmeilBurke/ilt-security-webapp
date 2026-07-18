import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import type { Staff } from "@/utils/interfaces";

const TabStaff = ({ staff }: { staff: Staff[] }) => {
	const router = useRouter();
	return (
		<VStack w="full" gap={4} alignItems="flex-start" >
			<Button onClick={() => { router.navigate({ to: '/create/staff' }) }}>Add New Staff</Button>
			<VStack w="full" alignItems="flex-start" >
				{staff.map((person) => {
					return (
						<Text key={person.id}>
							{person.name}
						</Text>
					);
				})}
			</VStack>
			<Button onClick={() => { router.navigate({ to: '/sign-in' }) }}>Sign Out</Button>
		</VStack>
	);
};

export default TabStaff;
