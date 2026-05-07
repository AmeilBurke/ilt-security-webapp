import {
  Avatar,
  Button,
  Checkbox,
  Collapsible,
  DatePicker,
  type DateValue,
  Field,
  HStack,
  IconButton,
  Input,
  Portal,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { LiaBackspaceSolid } from "react-icons/lia";
import { LuChevronRight } from "react-icons/lu";
import createNewBan from "@/api-requests/ban/createNewBan";
import getAllBannedPeople from "@/api-requests/banned-people/getAllBannedPeople";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageCreate from "@/components/pages/PageCreate";
import { capitalizeString, isErrorCheck } from "@/utils";
import type { BannedPerson, CreateBanDto, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const formatDate = (date: DateValue) => {
  const day = date.day.toString().padStart(2, "0");
  const month = date.month.toString().padStart(2, "0");
  const year = date.year.toString();
  return `${day}/${month}/${year}`;
};

export const Route = createFileRoute("/create/ban")({
  component: RouteComponent,
  loader: async () => {
    const [allBannedPeople, allVenues] = await Promise.all([
      getAllBannedPeople(),
      getAllVenues(),
    ]);

    return {
      allBannedPeople:
        isErrorCheck(allBannedPeople)
          ? []
          : (allBannedPeople as BannedPerson[]),
      allVenues:
        isErrorCheck(allBannedPeople)
          ? []
          : (allVenues as Venue[]),
    };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { allBannedPeople, allVenues } = Route.useLoaderData();

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [endDate, setEndDate] = useState<DateValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [bannedPersonSearch, setBannedPersonSearch] = useState("");
  const [selectedBannedPerson, setSelectedBannedPerson] = useState<BannedPerson | undefined>(undefined);

  const [venueValues, setVenueValues] = useState(() =>
    allVenues.map((venue) => ({
      label: venue.name,
      checked: false,
      value: venue.id,
    })),
  );

  const allChecked = venueValues.every((v) => v.checked);
  const noneChecked = venueValues.every((v) => !v.checked);
  const indeterminate = venueValues.some((v) => v.checked) && !allChecked;

  if (allVenues.length === 0) {
    toast.error("Could not get list of venues")
    router.navigate({
      to: "/"
    });
  }

  const bannedPeopleFiltered = allBannedPeople.filter((person) =>
    person.name.toLowerCase().includes(bannedPersonSearch.toLowerCase()),
  );

  const handlePersonSelect = (id: string) => {
    const person = allBannedPeople.find((p) => p.id === id);
    if (person) setSelectedBannedPerson(person);
  };

  const handleClear = () => {
    setSelectedBannedPerson(undefined);
  };

  const createBanHandler = async () => {
    if (!selectedBannedPerson) {
      toast.error("Select a banned person to create a ban for");
      return;
    }
    if (!reason) {
      toast.error("Enter a reason for the ban");
      return;
    }
    if (endDate.length === 0) {
      toast.error("Enter a date for the ban to end");
      return;
    }

    const { year, month, day } = endDate[0];
    const venueIds = venueValues.filter((v) => v.checked).map((v) => v.value);

    const createBanDto: CreateBanDto = {
      personId: selectedBannedPerson.id,
      reason,
      notes,
      startDate: dayjs().toISOString(),
      endDate: dayjs(`${year}/${month}/${day}`).toISOString(),
      isBlanketBan: allChecked,
      venueIds,
    };

    setLoading(true);
    try {
      const result = await createNewBan(createBanDto);

      if (isAxiosError(result)) {
        router.navigate({
          to: "/error",
          search: { error: result.message },
        });
        return;
      }

      if (isApiRequestError(result)) {
        router.navigate({
          to: "/error",
          search: {
            error: capitalizeString(result.error),
          },
        });
        return;
      }

      toast.success("Ban was created");
      router.navigate({ to: "/" });
    } catch (error) {
      router.navigate({
        to: "/error",
        search: {
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const inputs = (
    <>
      <Collapsible.Root
        w="full"
        px={2}
        borderBottomColor="blackAlpha.300"
        borderWidth="1px"
      >
        <Collapsible.Trigger
          w="full"
          paddingY={0}
          display="flex"
          gap={2}
          alignItems="center"
        >
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <LuChevronRight />
          </Collapsible.Indicator>
          <Text w="full" textAlign="start" fontSize="sm">
            {selectedBannedPerson
              ? selectedBannedPerson.name
              : "Select banned person here"}
          </Text>
          <IconButton
            opacity={selectedBannedPerson ? 100 : 0}
            variant="ghost"
            onClick={handleClear}
          >
            <LiaBackspaceSolid />
          </IconButton>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <Stack padding={4} gap={8}>
            <Input
              placeholder="Search people"
              value={bannedPersonSearch}
              onChange={(e) => setBannedPersonSearch(e.target.value)}
            />
            <RadioGroup.Root
              value={selectedBannedPerson?.id ?? ""}
              onValueChange={(e) => handlePersonSelect(String(e.value))}
            >
              <VStack w="full" gap={8}>
                {bannedPeopleFiltered.map((person) => (
                  <RadioGroup.Item
                    w="full"
                    key={person.id}
                    value={person.id}
                    alignItems="center"
                  >
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      <HStack gap={4}>
                        <Avatar.Root size="lg">
                          <Avatar.Fallback name={person.name} />
                          <Avatar.Image src={person.imagePath} />
                        </Avatar.Root>
                        <Text>{capitalizeString(person.name)}</Text>
                      </HStack>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </VStack>
            </RadioGroup.Root>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>

      <Field.Root required>
        <Field.Label>
          Reason <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for ban"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Notes</Field.Label>
        <Input
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter extra details here if needed"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root required>
        <DatePicker.Root
          required
          format={formatDate}
          variant="flushed"
          placeholder="dd/mm/yyyy"
          openOnClick
          value={endDate}
          onValueChange={(e) => setEndDate(e.value)}
        >
          <DatePicker.Label asChild>
            <Field.Label>
              Ban End Date <Field.RequiredIndicator />
            </Field.Label>
          </DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input />
            <DatePicker.IndicatorGroup />
          </DatePicker.Control>
          <Portal>
            <DatePicker.Positioner>
              <DatePicker.Content>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                </DatePicker.View>
                <DatePicker.View view="month">
                  <DatePicker.Header />
                  <DatePicker.MonthTable />
                </DatePicker.View>
                <DatePicker.View view="year">
                  <DatePicker.Header />
                  <DatePicker.YearTable />
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.Root>
      </Field.Root>

      <Stack w="full" gap={4} align="flex-start">
        <Text fontSize="sm">Ban From:</Text>
        <Checkbox.Root
          checked={indeterminate ? "indeterminate" : allChecked}
          onCheckedChange={(e) =>
            setVenueValues((current) =>
              current.map((v) => ({ ...v, checked: !!e.checked })),
            )
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Blanket Ban?</Checkbox.Label>
        </Checkbox.Root>

        {venueValues.map((item, index) => (
          <Checkbox.Root
            ms="10"
            key={item.value}
            checked={item.checked}
            onCheckedChange={(e) =>
              setVenueValues((current) =>
                current.map((v, i) =>
                  i === index ? { ...v, checked: !!e.checked } : v,
                ),
              )
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label textTransform="capitalize">
              {item.label}
            </Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </>
  );

  const button = (
    <Button
      disabled={
        !selectedBannedPerson ||
        reason === "" ||
        endDate.length === 0 ||
        noneChecked
      }
      onClick={createBanHandler}
      loading={loading}
    >
      Create New Ban
    </Button>
  );

  return (
    <PageCreate
      heading="Create Ban"
      subText="Fill out the details below to create a ban"
      inputs={inputs}
      button={button}
    />
  );
}