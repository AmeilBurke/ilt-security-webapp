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
import { capitalizeString } from "@/utils";
import type { BannedPerson, CreateBanDto, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/ban")({
  component: RouteComponent,
  loader: async () => {
    let [allBannedPeople, allVenues] = await Promise.all([
      getAllBannedPeople(),
      getAllVenues(),
    ]);

    if (isAxiosError(allBannedPeople) || isApiRequestError(allBannedPeople)) {
      allBannedPeople = [];
    }

    if (isAxiosError(allVenues) || isApiRequestError(allVenues)) {
      allVenues = [];
    }

    return { allBannedPeople, allVenues };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { allBannedPeople, allVenues } = Route.useLoaderData() as {
    allBannedPeople: BannedPerson[];
    allVenues: Venue[];
  };

  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [endDate, setEndDate] = useState<DateValue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [bannedPersonSearch, setBannedPersonSearch] = useState("");
  const [selectedBannedPerson, setSelectedBannedPerson] = useState<
    BannedPerson | undefined
  >(undefined);

  const initialValues = allVenues.map((venue) => {
    return {
      label: venue.name,
      checked: false,
      value: venue.id,
    };
  });

  const [venueValues, setVenueValues] = useState(initialValues);
  const allChecked = venueValues.every((value) => value.checked);
  const noneChecked = venueValues.every((value) => !value.checked);
  const indeterminate =
    venueValues.some((value) => value.checked) && !allChecked;

  const format = (date: DateValue) => {
    const day = date.day.toString().padStart(2, "0");
    const month = date.month.toString().padStart(2, "0");
    const year = date.year.toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  if (allVenues.length === 0) {
    return "Error fetching venues";
  }

  const bannedPeopleFiltered = allBannedPeople.filter((person) =>
    person.name.toLowerCase().includes(bannedPersonSearch.toLowerCase()),
  );

  const handlePersonSelect = (id: string) => {
    const person = allBannedPeople.find((p) => p.id === id);
    setSelectedBannedPerson(person);
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

    const formattedDate = `${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`;

    const venueIds = venueValues
      .filter((value) => value.checked)
      .map((value) => value.value);

    const createBanDto: CreateBanDto = {
      personId: selectedBannedPerson.id,
      reason: reason,
      notes: notes,
      startDate: dayjs().toISOString(),
      endDate: dayjs(formattedDate).toISOString(),
      isBlanketBan: allChecked,
      venueIds: venueIds,
    };
    setLoading(true);

    const result = await createNewBan(createBanDto);

    setLoading(false);

    if (isApiRequestError(result)) {
      toast.error(
        `Failed to create ban because:\n - ${capitalizeString(result.message.join(`\n`))}`,
      );
      return;
    }

    if (isAxiosError(result)) {
      router.navigate({
        to: "/error",
        search: { error: result.message },
      });
      return;
    }

    toast.success("Account was created");
    router.navigate({ to: "/" });
    return;
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
          onChange={(event) => setReason(event.target.value)}
          placeholder="Enter reason for ban"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>
          Notes <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Enter extra details here if needed"
          variant="flushed"
        />
      </Field.Root>

      <DatePicker.Root
        required
        format={format}
        variant="flushed"
        placeholder="dd/mm/yyyy"
        openOnClick
        value={endDate}
        onValueChange={(e) => setEndDate(e.value)}
      >
        <DatePicker.Label>Ban End Date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.IndicatorGroup></DatePicker.IndicatorGroup>
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

      <Stack w="full" gap={4} align="flex-start">
        <Text fontSize="sm">Ban From:</Text>
        <Checkbox.Root
          checked={indeterminate ? "indeterminate" : allChecked}
          onCheckedChange={(e) => {
            setVenueValues((current) =>
              current.map((value) => ({ ...value, checked: !!e.checked })),
            );
          }}
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
            onCheckedChange={(e) => {
              setVenueValues((current) => {
                const newValues = [...current];
                newValues[index] = {
                  ...newValues[index],
                  checked: !!e.checked,
                };
                return newValues;
              });
            }}
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
