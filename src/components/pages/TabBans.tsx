import {
	Button,
	CloseButton,
	Dialog,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

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
								<Button asChild variant="outline">
									<Link to="/create/bannedPerson">No</Link>
								</Button>
								<Button asChild variant="outline">
									<Link to="/create/ban">Yes</Link>
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</VStack >
	);
};

export default TabBans;
