import { Checkbox, type DateValue, Field, Input, Stack, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Ban, VenueSelection } from "@/utils/interfaces";
import CalenderInput from "../CalenderInput";

export type BanEditDetailsProps = {
  selectedBan: Ban | undefined;
  reason: string;
  onSetReason: (text: string) => void;
  notes?: string;
  onSetNotes: (text: string) => void;
  endDate: DateValue[];
  onSetEndDate: (date: DateValue[]) => void;
  allChecked: boolean;
  indeterminate: boolean;
  venueSelectionValues: VenueSelection[];
  onSetVenueSelectionValues: (venueSelectionValues: VenueSelection[]) => void;
};

// need to check if this is finished
const BanEditDetails = ({
  selectedBan,
  // reason,
  onSetReason,
  // notes,
  onSetNotes,
  endDate,
  onSetEndDate,
  allChecked,
  indeterminate,
  venueSelectionValues,
  onSetVenueSelectionValues,
}: BanEditDetailsProps) => {
  if (!selectedBan) {
    return null;
  }

  return (
    <VStack gap={8}>
      <Field.Root required>
        <Field.Label>Reason</Field.Label>
        <Input
          onChange={(e) => onSetReason(e.target.value)}
          placeholder={selectedBan?.reason}
          variant="flushed"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Notes</Field.Label>
        <Input
          onChange={(e) => onSetNotes(e.target.value)}
          placeholder={selectedBan?.notes || "testing"}
          variant="flushed"
        />
      </Field.Root>

      <CalenderInput
        selectedDate={endDate}
        onDateSelect={(date) => onSetEndDate(date)}
        labelText="Ban End Date"
        // helperText="Dates can be changed per venue by going into the venue & viewing the ban"
        placeholder={dayjs(selectedBan.endDate).format("DD/MM/YYYY")}
      />

      <Stack w="full" gap={4} align="flex-start">
        <Text fontSize="sm">Ban From:</Text>
        <Checkbox.Root
          checked={indeterminate ? "indeterminate" : allChecked}
          onCheckedChange={(e) =>
            onSetVenueSelectionValues(
              venueSelectionValues.map((v) => ({ ...v, checked: !!e.checked })),
            )
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Blanket Ban?</Checkbox.Label>
        </Checkbox.Root>

        {venueSelectionValues.map((item, index) => (
          <Checkbox.Root
            ms="10"
            key={item.value}
            checked={item.checked}
            onCheckedChange={(e) =>
              onSetVenueSelectionValues(
                venueSelectionValues.map((v, i) =>
                  i === index ? { ...v, checked: !!e.checked } : v,
                ),
              )
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label textTransform="capitalize">{item.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </VStack>
  );
};

export default BanEditDetails;
