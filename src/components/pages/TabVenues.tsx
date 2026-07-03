import { Button, VStack } from "@chakra-ui/react";
import { Link, useRouter } from "@tanstack/react-router";
import { Role } from "@/utils/enums";
import type { Venue } from "@/utils/interfaces";
import ComponentGrid from "../ui/ComponentGrid";
import VenueCard from "../ui/Venues/VenueCard";

export type TabVenuesProps = {
    venues: Venue[];
    userRole: Role;
};

const TabVenues = ({ venues, userRole }: TabVenuesProps) => {
    const router = useRouter();

    return (
        <VStack w="full" gap={8}>
            {
                userRole === Role.ADMIN && (
                    <Button w="full" onClick={() => router.navigate({ to: "/create/venue" })}>
                        Create New Alert
                    </Button>
                )
            }
            <ComponentGrid>
                {venues.map((venue) => {
                    return (
                        <Link key={venue.id} to={`/venue/$venueId`} params={{ venueId: venue.id }}>
                            <VenueCard venue={venue} />
                        </Link>
                    );
                })}
            </ComponentGrid>
        </VStack >
    );
};

export default TabVenues;
