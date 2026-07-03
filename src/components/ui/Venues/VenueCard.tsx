import { Image, Text, VStack } from "@chakra-ui/react";
import { capitalizeString } from "@/utils";
import type { Venue } from "@/utils/interfaces";

export type VenueCardProps = {
    venue: Venue;
};

const VenueCard = ({ venue }: VenueCardProps) => {
    return (
        <VStack h="100%" align="flex-start" gap={2}>
            <Image
                w="full"
                aspectRatio={1}
                objectFit="cover"
                src={venue.imagePath}
            />
            <VStack
                w="full"
                alignItems="flex-start"
                gap={1}
                fontSize="small"
                color="gray.500"
            >
                <Text fontSize="md" color="black">
                    {capitalizeString(venue.name)}
                </Text>
            </VStack>
        </VStack>
    );
};

export default VenueCard;
