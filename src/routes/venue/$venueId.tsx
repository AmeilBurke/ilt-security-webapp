import {
  DataList,
  Field,
  Heading,
  IconButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LiaArrowLeftSolid } from "react-icons/lia";
import getProfileFromJwt from "@/api-requests/authentication/getProfileFromJwt";
import getAllBannedFromVenueId from "@/api-requests/banned-people/getAllBannedFromVenueId";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import getVenueById from "@/api-requests/venues/getVenueById";
import GridOfBannedPeopleWithBanDetails from "@/components/ui/BannedPerson/GridOfBannedPeopleWithBanDetails";
import ContentContainer from "@/components/ui/ContentContainer";
import {
  isErrorCheck,
} from "@/utils";
import type { Role } from "@/utils/enums";
import type {
  BannedPerson,
  DialogMode,
  Venue,
} from "@/utils/interfaces";

export const Route = createFileRoute("/venue/$venueId")({
  component: RouteComponent,
  loader: async ({
    params,
  }): Promise<{
    venue: Venue;
    allVenues: Venue[];
    bannedPeople: BannedPerson[];
    role: Role;
  }> => {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
      throw redirect({ to: "/sign-in" });
    }

    const venueResult = await getVenueById(params.venueId);
    const allVenuesResult = await getAllVenues();
    const bannedPeopleResult = await getAllBannedFromVenueId(params.venueId);

    const staffResult = await getProfileFromJwt();

    if (
      isErrorCheck(venueResult) ||
      isErrorCheck(allVenuesResult) ||
      isErrorCheck(bannedPeopleResult) ||
      isErrorCheck(staffResult)
    ) {
      toast.error("Can't get list of people banned from venue");
      throw redirect({ to: "/" });
    }

    return {
      venue: venueResult,
      allVenues: allVenuesResult,
      bannedPeople: bannedPeopleResult,
      role: staffResult.role,
    };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { venue, allVenues, bannedPeople, role } = Route.useLoaderData();
  const [searchValue, setSearchValue] = useState<string>("");
  const bannedPeopleFiltered = useMemo(() => {
    if (searchValue === "") return bannedPeople;
    return bannedPeople.filter((person) =>
      person.name
        .toLowerCase()
        .trim()
        .includes(searchValue.toLowerCase().trim()),
    );
  }, [bannedPeople, searchValue]);

  const [dialogMode, setDialogMode] = useState<DialogMode>("none");

  return (
    <ContentContainer>
      <VStack gap={8} alignItems="flex-start">
        <IconButton variant="ghost" onClick={() => router.navigate({ to: "/" })}>
          <LiaArrowLeftSolid />
        </IconButton>
        <Heading>{venue.name}</Heading>

        <DataList.Root>
          <DataList.Item>
            <DataList.ItemLabel>
              {venue.venueManagers.length > 1 ? "Venue Managers" : "Venue Manager"}
            </DataList.ItemLabel>
            {venue.venueManagers.map((manager) => {
              return (
                <DataList.ItemValue key={manager.id}>{manager.staff?.name}</DataList.ItemValue>
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

        <GridOfBannedPeopleWithBanDetails
          bansFiltered={bannedPeopleFiltered}
          dialogMode={dialogMode}
          onSetDialogMode={(value) => setDialogMode(value)}
          venues={allVenues}
          userRole={role}
          router={router}
        />
      </VStack>
    </ContentContainer>
  );
}
