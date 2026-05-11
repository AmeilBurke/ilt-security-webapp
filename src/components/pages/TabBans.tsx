import {
	Button,
	CloseButton,
	Dialog,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { BannedPerson } from "@/utils/interfaces";

export type TabPendingBansProps = {
	allBanned: BannedPerson[];
};

const TabBans = ({ allBanned }: TabPendingBansProps) => {
	const router = useRouter()
	const [open, setOpen] = useState(false);

	const openHandler = () => {
		if (allBanned.length !== 0) {
			setOpen(true);
			return
		}
		router.navigate({ to: "/create/bannedPerson" })
	};

	return (
		<VStack onClick={openHandler}>
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
		</VStack>
	);
};

export default TabBans;
