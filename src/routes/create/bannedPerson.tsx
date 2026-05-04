import {
  Button,
  Checkbox,
  CloseButton,
  DatePicker,
  type DateValue,
  Field,
  FileUpload,
  Input,
  InputGroup,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuFileUp } from "react-icons/lu";
import createNewBannedPerson from "@/api-requests/banned-people/createNewBannedPerson";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageCreate from "@/components/pages/PageCreate";
import { capitalizeString } from "@/utils";
import type { ApiRequestError, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/bannedPerson")({
  component: RouteComponent,
  loader: async () => {
    const allVenues: Venue[] | ApiRequestError | AxiosError =
      await getAllVenues();

    if (isApiRequestError(allVenues) || isAxiosError(allVenues)) {
      return [];
    }

    return allVenues;
  },
});

function RouteComponent() {
  const router = useRouter();
  const allVenues = Route.useLoaderData() as Venue[];

  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [endDate, setEndDate] = useState<DateValue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    const year = (date.year % 100).toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  if (allVenues.length === 0) {
    return "Error fetching venues";
  }

  const createBannedPersonHandler = async () => {
    setLoading(true);

    const createBannedPersonDto = new FormData();

    if (image) {
      createBannedPersonDto.append("image", image);
    }

    createBannedPersonDto.append("name", name);
    createBannedPersonDto.append("reason", reason);

    if (notes) {
      createBannedPersonDto.append("notes", notes);
    }

    const formattedDate = `${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`;

    createBannedPersonDto.append("startDate", dayjs().toISOString());
    createBannedPersonDto.append("endDate", dayjs(formattedDate).toISOString());
    createBannedPersonDto.append("isBlanketBan", String(allChecked));

    const venueIds = venueValues
      .filter((value) => value.checked)
      .map((value) => value.value);

    venueIds.forEach((id) => {
      createBannedPersonDto.append("venueIds", id);
    });

    setLoading(true);
    console.log(createBannedPersonDto);

    const result = await createNewBannedPerson(createBannedPersonDto);

    console.log(result);

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

    toast.success("Ban was created");
    router.navigate({ to: "/" });
    return;
  };

  const inputs = (
    <>
      <FileUpload.Root
        onFileChange={(e) => setImage(e.acceptedFiles[0])}
        gap="1"
      >
        <FileUpload.HiddenInput />
        <FileUpload.Label>Image Of Person</FileUpload.Label>
        <InputGroup
          startElement={<LuFileUp />}
          endElement={
            <FileUpload.ClearTrigger asChild>
              <CloseButton
                me="-1"
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                focusRingWidth="2px"
                pointerEvents="auto"
              />
            </FileUpload.ClearTrigger>
          }
        >
          <Input asChild>
            <FileUpload.Trigger>
              <FileUpload.Context>
                {({ acceptedFiles }) => (
                  <Text lineClamp={1}>
                    {acceptedFiles.length > 0
                      ? acceptedFiles[0].name
                      : "Upload an image of the person"}
                  </Text>
                )}
              </FileUpload.Context>
            </FileUpload.Trigger>
          </Input>
        </InputGroup>
      </FileUpload.Root>

      <Field.Root required>
        <Field.Label>
          Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter name of person"
          variant="flushed"
        />
      </Field.Root>

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
          placeholder="Enter any extra details here"
          variant="flushed"
        />
      </Field.Root>

      <DatePicker.Root
        format={format}
        variant="flushed"
        placeholder="dd/mm/yy"
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
        image === undefined ||
        name === "" ||
        reason === "" ||
        endDate.length === 0 ||
        noneChecked
      }
      onClick={createBannedPersonHandler}
      loading={loading}
    >
      Create New Ban
    </Button>
  );

  return (
    <PageCreate
      heading="Create Ban For New Person"
      subText="Fill out the details below to create a new banned person"
      inputs={inputs}
      button={button}
    />
  );
}
