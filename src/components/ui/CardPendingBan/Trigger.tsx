import { Image, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { capitalizeString } from "@/utils";

type CardPendingBanTriggerProps = {
    imagePath: string;
    name: string;
    createdBy: string;
    startDate: Date;
    reason: string;
};

const CardPendingBanTrigger = ({ imagePath, name, createdBy, startDate, reason }: CardPendingBanTriggerProps) => {
    return (
        <VStack
            h="100%"
            align="flex-start"
            gap={2}
        >
            <Image
                w="full"
                aspectRatio={1}
                objectFit="cover"
                src={imagePath}
            />
            <VStack
                w="full"
                alignItems="flex-start"
                gap={1}
                fontSize="small"
                color="gray.500"
            >
                <Text
                    fontSize='md'
                    color="black"
                >
                    {capitalizeString(name)}
                </Text>
                <Text>
                    Uploaded by {capitalizeString(createdBy)} on {dayjs(startDate).format("DD/MM/YYYY")}
                </Text>
                <Text
                    textTransform="capitalize"
                >
                    Reason given: {reason}
                </Text>
            </VStack>
        </VStack>
    );
};

export default CardPendingBanTrigger;
