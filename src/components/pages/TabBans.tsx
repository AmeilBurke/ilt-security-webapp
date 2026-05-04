import {
	Button,
	CloseButton,
	Dialog,
	HStack,
	IconButton,
	Image,
	Menu,
	Portal,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

const TabBans = () => {
	const [open, setOpen] = useState(false);

	return (
		<VStack onClick={() => setOpen(true)}>
			<Button>Create A New Ban</Button>

			<Dialog.Root
				role="alertdialog"
				open={open}
				onOpenChange={(e) => setOpen(e.open)}
				placement="center"
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.CloseTrigger asChild>
								<CloseButton />
							</Dialog.CloseTrigger>
							<Dialog.Header>
								<Dialog.Title>Create Ban</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Text>Is this ban for someone with a previous ban?</Text>
							</Dialog.Body>
							<Dialog.Footer>
								<Link to="/create/bannedPerson">
									<Button variant="outline">No</Button>
								</Link>
								<Link to="/create/ban">
									<Button colorPalette="current">Yes</Button>
								</Link>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</VStack>
	);
};

export default TabBans;
