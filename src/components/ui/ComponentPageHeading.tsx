import { Heading, Text, VStack } from "@chakra-ui/react";

export type ComponentPageHeadingProps = {
    heading: string;
    subHeading?: string;
}

const ComponentPageHeading = ({ heading, subHeading }: ComponentPageHeadingProps) => {
    return (
        <VStack w="full">
            <Heading textStyle="title">{heading}</Heading>
            <Text textStyle="muted">{subHeading}</Text>
        </VStack>
    )
}

export default ComponentPageHeading