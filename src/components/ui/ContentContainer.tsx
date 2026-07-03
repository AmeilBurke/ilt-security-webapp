import { Container } from "@chakra-ui/react";

const ContentContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<Container p={[4, null, 8]} >
			{children}
		</Container>)
};

export default ContentContainer;
