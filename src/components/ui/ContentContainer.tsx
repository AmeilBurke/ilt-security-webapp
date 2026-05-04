import { Container } from "@chakra-ui/react";

const ContentContainer = ({ children }: { children: React.ReactNode }) => {
	return <Container>{children}</Container>;
};

export default ContentContainer;
