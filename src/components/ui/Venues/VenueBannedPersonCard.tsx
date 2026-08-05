import { Badge, Image, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { capitalizeString } from "@/utils";
import type { BannedPerson } from "@/utils/interfaces";

type VenueBannedPersonCardProps = {
  person: BannedPerson;
  venueId: string;
};

const VenueBannedPersonCard = ({ person, venueId }: VenueBannedPersonCardProps) => {
  const hasActiveBanFromVenue = (): boolean => {
    return (
      person.bans?.some((ban) => {
        const banVenueIds = ban.venueBans.filter((vb) => vb.venueId === venueId);
        return dayjs(ban.endDate).isAfter(dayjs()) && banVenueIds.length > 0;
      }) ?? false
    );
  };

  return (
    <VStack h="100%" align="flex-start" gap={2}>
      <Image w="full" aspectRatio={1} objectFit="cover" src={person.imagePath} />
      <VStack w="full" alignItems="flex-start" gap={1} fontSize="small" color="gray.500">
        <Text fontSize="md" color="black">
          {capitalizeString(person.name)}
        </Text>
        {hasActiveBanFromVenue() ? (
          <Badge colorPalette="red">Has Active ban</Badge>
        ) : (
          <Badge>Ban Expired</Badge>
        )}
      </VStack>
    </VStack>
  );
};

export default VenueBannedPersonCard;
