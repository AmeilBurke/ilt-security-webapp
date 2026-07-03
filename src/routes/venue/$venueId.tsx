import {
  Box,
  Button,
  DataList,
  Field,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LiaArrowLeftSolid } from "react-icons/lia";
import getAllBannedFromVenueId from "@/api-requests/banned-people/getAllBannedFromVenueId";
import getVenueById from "@/api-requests/venues/getVenueById";
import ComponentDialog from "@/components/ui/ComponentDialog";
import ComponentGrid from "@/components/ui/ComponentGrid";
import ContentContainer from "@/components/ui/ContentContainer";
import ComponentVenueBanDetails from "@/components/ui/Venues/ComponentVenueBanDetails";
import VenueBannedPersonCard from "@/components/ui/Venues/VenueBannedPersonCard";
import { isErrorCheck } from "@/utils";
import type { BannedPerson, Venue } from "@/utils/interfaces";

export const Route = createFileRoute("/venue/$venueId")({
  component: RouteComponent,
  loader: async ({
    params,
  }): Promise<{ venue: Venue; bannedPeople: BannedPerson[] }> => {
    const venueResult = await getVenueById(params.venueId);
    const bannedPeopleResult = await getAllBannedFromVenueId(params.venueId);

    if (isErrorCheck(venueResult) || isErrorCheck(bannedPeopleResult)) {
      toast.error("Can't get list of people banned from venue");
      throw redirect({ to: "/" });
    }

    return { venue: venueResult, bannedPeople: bannedPeopleResult };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { venue, bannedPeople } = Route.useLoaderData();
  const [searchValue, setSearchValue] = useState<string>("");
  const [bannedPeopleFiltered, setBannedPeopleFiltered] =
    useState<BannedPerson[]>(bannedPeople);

  const [isBanDetailsDialogOpen, setIsBanDetailsDialogOpen] =
    useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<
    BannedPerson | undefined
  >(undefined);

  // For searching people
  useEffect(() => {
    if (searchValue === "") {
      setBannedPeopleFiltered(bannedPeople);
    } else {
      setBannedPeopleFiltered(
        bannedPeople.filter((person) =>
          person.name
            .toLowerCase()
            .trim()
            .includes(searchValue.toLowerCase().trim()),
        ),
      );
    }
  }, [bannedPeople, searchValue]);

  const handleShowBansForSelectedPerson = (selectedPerson: BannedPerson) => {
    setSelectedPerson(selectedPerson);
    setIsBanDetailsDialogOpen(true);
  };

  const bansFilteredForVenue = selectedPerson?.bans?.filter(
    (ban) => ban.venueBans?.some((vb) => vb.venueId === venue.id) ?? false,
  );

  const handleCloseDialog = () => {
    setIsBanDetailsDialogOpen(false);
  };

  return (
    <ContentContainer>
      <VStack gap={8} alignItems="flex-start">
        <IconButton
          variant="ghost"
          onClick={() => router.navigate({ to: "/" })}
        >
          <LiaArrowLeftSolid />
        </IconButton>
        <Heading>{venue.name}</Heading>

        <DataList.Root>
          <DataList.Item>
            <DataList.ItemLabel>
              {venue.venueManagers.length > 1
                ? "Venue Managers"
                : "Venue Manager"}
            </DataList.ItemLabel>
            {venue.venueManagers.map((manager) => {
              return (
                <DataList.ItemValue key={manager.id}>
                  {manager.staff?.name}
                </DataList.ItemValue>
              );
            })}
          </DataList.Item>

          <DataList.Item>
            <DataList.ItemLabel>Phone Number</DataList.ItemLabel>
            <DataList.ItemValue>{venue.phone}</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>

        {bannedPeople.length > 0 && (
          <Field.Root required>
            <Field.Label>Search Through Bans Here</Field.Label>
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search Bans Here"
              variant="flushed"
            />
          </Field.Root>
        )}

        <ComponentGrid>
          {bannedPeopleFiltered.length > 0 ? (
            bannedPeopleFiltered.map((person) => (
              <Box
                key={person.id}
                onClick={() => handleShowBansForSelectedPerson(person)}
                cursor="pointer"
              >
                <VenueBannedPersonCard key={person.id} person={person} venueId={venue.id} />
              </Box>
            ))
          ) : (
            <Text>No Person Found</Text>
          )}
        </ComponentGrid>

        <ComponentDialog
          isOpen={isBanDetailsDialogOpen}
          onCloseDialog={() => setIsBanDetailsDialogOpen(false)}
          title={selectedPerson?.name || ""}
          body={<ComponentVenueBanDetails bans={bansFilteredForVenue} />}
          footer={<HStack>
            <Button onClick={handleCloseDialog}>Close</Button>
          </HStack>}
          onCloseFinish={() => setSelectedPerson(undefined)}
        />
      </VStack>
    </ContentContainer>
  );
}
