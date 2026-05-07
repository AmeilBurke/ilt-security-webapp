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
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuFileUp } from "react-icons/lu";
import createNewBannedPerson from "@/api-requests/banned-people/createNewBannedPerson";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageCreate from "@/components/pages/PageCreate";
import { capitalizeString, isErrorCheck } from "@/utils";
import type { Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

const formatDate = (date: DateValue) => {
  const day = date.day.toString().padStart(2, "0");
  const month = date.month.toString().padStart(2, "0");
  const year = date.year.toString();
  return `${day}/${month}/${year}`;
};

export const Route = createFileRoute("/create/bannedPerson")({
  component: RouteComponent,
  loader: async () => {
    const allVenues = await getAllVenues();

    if (isErrorCheck(allVenues)) {
      return [] as Venue[];
    }

    return allVenues as Venue[];
  },
});

function RouteComponent() {
  const router = useRouter();
  const allVenues = Route.useLoaderData();

  const [image, setImage] = useState<File | undefined>(undefined);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [endDate, setEndDate] = useState<DateValue[]>([]);
  const [loading, setLoading] = useState(false);

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

  const createBannedPersonHandler = async () => {
    if (!name) {
      toast.error("Enter a name for the person");
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

    const createBannedPersonDto = new FormData();

    if (image) {
      createBannedPersonDto.append("image", image);
    }

    createBannedPersonDto.append("name", name);
    createBannedPersonDto.append("reason", reason);

    if (notes) {
      createBannedPersonDto.append("notes", notes);
    }

    createBannedPersonDto.append("startDate", dayjs().toISOString());
    createBannedPersonDto.append(
      "endDate",
      dayjs(`${year}/${month}/${day}`).toISOString(),
    );
    createBannedPersonDto.append("isBlanketBan", String(allChecked));

    venueIds.forEach((id) => {
      createBannedPersonDto.append("venueIds", id);
    });

    setLoading(true);
    try {
      const result = await createNewBannedPerson(createBannedPersonDto);

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

      toast.success("Banned person was created");
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
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name of person"
          variant="flushed"
        />
      </Field.Root>

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
          placeholder="Enter any extra details here"
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