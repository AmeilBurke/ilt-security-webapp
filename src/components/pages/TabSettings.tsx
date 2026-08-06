import { Text, VStack } from "@chakra-ui/react";
import type { Staff } from "@/utils/interfaces";

export type TabSettingsProps = {
    staff: Staff;
};

const TabSettings = ({ staff }: TabSettingsProps) => {
    return (
        <VStack w="full" gap={4}>
            <Text>Edit your details here</Text>
        </VStack>
    );
};

export default TabSettings;
