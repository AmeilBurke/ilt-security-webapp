import { Button, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { Venue } from "@/utils/interfaces";

const TabVenues = ({ venues }: { venues: Venue[] }) => {
    return (
        <>
            <Link to={'/create/venue'} >
                <Button>Create New Venue</Button>
            </Link>
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

export default TabVenues;
