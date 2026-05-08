import { SimpleGrid } from "@chakra-ui/react";

const ComponentGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <SimpleGrid w="full" columns={{ base: 2, lg: 4 }} gap={8}>
            {children}
        </SimpleGrid>
    );
};

export default ComponentGrid