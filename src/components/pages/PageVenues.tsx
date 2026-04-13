import { Text } from "@chakra-ui/react";
import type { Venue } from "@/utils/interfaces";

const PageVenues = ({ venues }: { venues: Venue[] }) => {
  return (
    <>
      {venues.map((venue) => {
        return (
          <Text key={venue.id}>
            {venue.id} : {venue.name}
          </Text>
        );
      })}
    </>
  );
};

export default PageVenues;
