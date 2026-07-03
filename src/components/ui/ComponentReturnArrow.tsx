import { IconButton } from "@chakra-ui/react";
import { type LinkProps, useRouter } from "@tanstack/react-router";
import { LiaArrowLeftSolid } from "react-icons/lia";

export type ComponentReturnArrowProps = {
	navigateTo: LinkProps["to"];
};

const ComponentReturnArrow = ({ navigateTo }: ComponentReturnArrowProps) => {
	const router = useRouter();
	return (
		<IconButton
			variant="ghost"
			onClick={() => router.navigate({ to: navigateTo })}
		>
			<LiaArrowLeftSolid />
		</IconButton>
	);
};

export default ComponentReturnArrow;
