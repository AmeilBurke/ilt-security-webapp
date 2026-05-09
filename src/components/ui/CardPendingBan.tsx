import {
    Button,
    Checkbox,
    CloseButton,
    DatePicker,
    type DateValue,
    Dialog,
    Field,
    Image,
    Input,
    Portal,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { capitalizeString } from "@/utils";
import type { Ban, Venue } from "@/utils/interfaces";
import ConfirmDialog from "./ConfirmDialog";

type CardPendingBanProps = {
    ban: Ban;
    venues: Venue[];
};

const formatDate = (date: DateValue) => {
    const day = date.day.toString().padStart(2, "0");
    const month = date.month.toString().padStart(2, "0");
    const year = date.year.toString();
    return `${day}/${month}/${year}`;
};

const CardPendingBan = ({ ban, venues }: CardPendingBanProps) => {

    const [name, setName] = useState(ban.person?.name);
    const [reason, setReason] = useState(ban.reason);
    const [notes, setNotes] = useState(ban.notes);
    const [endDate, setEndDate] = useState<DateValue[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [venueValues, setVenueValues] = useState(() => {
        const bannedVenueIds = new Set(
            ban.venueBans?.map((vb) => vb.venueId) ?? [],
        );

        return venues.map((venue) => ({
            label: venue.name,
            checked: bannedVenueIds.has(venue.id),
            value: venue.id,
        }));
    });

    const allChecked = venueValues.every((v) => v.checked);
    const noneChecked = venueValues.every((v) => !v.checked);
    const indeterminate = venueValues.some((v) => v.checked) && !allChecked;

    if (!ban.createdBy || !ban.person || !ban.venueBans) {
        return <Text>Couldn't get need details</Text>;
    }

    return (
        <Dialog.Root
            scrollBehavior="inside"
            placement="center"
            size="xl"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild cursor="pointer">
                <VStack h="100%" align="flex-start" gap={2}>
                    <Image
                        w="full"
                        aspectRatio={1}
                        objectFit="cover"
                        src={ban.person?.imagePath}
                    />
                    <VStack w="full" alignItems="flex-start" gap={1}>
                        <Text textTransform="capitalize">{ban.person.name}</Text>
                        <Text fontSize="small" color="gray.500">
                            Uploaded by {capitalizeString(ban.createdBy.name)} on{" "}
                            {dayjs(ban.startDate).format("DD/MM/YYYY")}
                        </Text>
                    </VStack>
                </VStack>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title textTransform="capitalize">
                                Details for {ban.person.name}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Body>
                            <VStack gap={8}>
                                <Text textStyle="muted">Click on any detail to change it</Text>

                                <Field.Root>
                                    <Field.Label>Name</Field.Label>
                                    <Input
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={ban.person.name}
                                        variant="flushed"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Reason</Field.Label>
                                    <Input
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={ban.reason}
                                        variant="flushed"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Notes</Field.Label>
                                    <Input
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={
                                            ban.notes ? ban.notes : "Enter any extra details here"
                                        }
                                        variant="flushed"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <DatePicker.Root
                                        format={formatDate}
                                        variant="flushed"
                                        placeholder={dayjs(ban.endDate).format("DD/MM/YYYY")}
                                        openOnClick
                                        value={endDate}
                                        onValueChange={(e) => setEndDate(e.value)}
                                    >
                                        <DatePicker.Label asChild>
                                            <Field.Label>Ban End Date</Field.Label>
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
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <ConfirmDialog
                                ban={ban}
                                open={confirmDialogOpen}
                                onSelectOpen={setConfirmDialogOpen}
                            >
                                <Button
                                    colorPalette="red"
                                    onClick={() => setConfirmDialogOpen(true)}
                                >
                                    Delete
                                </Button>
                            </ConfirmDialog>

                            <Button
                                colorPalette="current"
                                onClick={() => setOpen(false)}
                            >
                                Approve
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CardPendingBan;
