// import {
//     Avatar,
//     Box,
//     Button,
//     Checkbox,
//     CloseButton,
//     Collapsible,
//     type DateValue,
//     Dialog,
//     Field,
//     HStack,
//     IconButton,
//     Image,
//     Input,
//     Portal,
//     parseDate,
//     RadioGroup,
//     Stack,
//     Text,
//     VStack,
// } from "@chakra-ui/react";
// import { useRouter } from "@tanstack/react-router";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { LiaBackspaceSolid } from "react-icons/lia";
// import { LuChevronRight } from "react-icons/lu";
// import updateBanById from "@/api-requests/ban/updateBanById";
// import createNewVenueBans from "@/api-requests/venue-bans/createNewVenueBans";
// import { capitalizeString, isErrorCheck } from "@/utils";
// import type {
//     Ban,
//     BannedPerson,
//     CreateVenueBansDto,
//     UpdateBanDto,
//     Venue,
// } from "@/utils/interfaces";
// import CalenderInput from "./CalenderInput";

// type CardPendingBanProps = {
//     ban: Ban;
//     venues: Venue[];
//     allBanned: BannedPerson[];
// };

// // need to add "" checks, & re add details if user backspaces original reason 

// const CardPendingBan = ({ ban, venues, allBanned }: CardPendingBanProps) => {
//     const router = useRouter();
//     const [selectedBannedPerson, setSelectedBannedPerson] = useState<BannedPerson | undefined>(() => allBanned.find((person) => person.id === ban.personId));
//     const [bannedPersonSearchValue, setBannedPersonSearchValue] = useState("");

//     const [reason, setReason] = useState(ban.reason);
//     const [notes, setNotes] = useState(ban.notes);
//     const [endDate, setEndDate] = useState<DateValue[]>([]);

//     const [venueValues, setVenueValues] = useState(() => {
//         const bannedVenueIds = new Set(ban.venueBans?.map((vb) => vb.venueId));

//         return venues.map((venue) => {
//             const existingBan = ban.venueBans?.find((vb) => vb.venueId === venue.id);
//             return {
//                 label: venue.name,
//                 checked: bannedVenueIds.has(venue.id),
//                 value: venue.id,
//                 endDate: existingBan
//                     ? [parseDate(existingBan.endDate.split("T")[0])]
//                     : ([] as DateValue[]),
//             };
//         });
//     });

//     const allChecked = venueValues.every((v) => v.checked);
//     const noneChecked = venueValues.every((v) => !v.checked);
//     const indeterminate = venueValues.some((v) => v.checked) && !allChecked;

//     useEffect(() => {
//         if (!ban.createdBy || !ban.person || !ban.venueBans) {
//             toast.error("Couldn't get needed details. Try again later");
//             router.navigate({ to: "/" });
//         }
//     }, [ban.createdBy, ban.person, ban.venueBans, router]);


//     const handleClear = () => {
//         setSelectedBannedPerson(undefined);
//     };

//     const handlePersonSelect = (id: string) => {
//         const person = allBanned.find((person) => person.id === id);
//         if (person) setSelectedBannedPerson(person);
//     };

//     const bannedPeopleFiltered = allBanned.filter((person) =>
//         person.name.toLowerCase().includes(bannedPersonSearchValue.toLowerCase()),
//     );

//     const handleGlobalDateSelect = (date: DateValue[]) => {
//         setEndDate(date);
//         setVenueValues((current) => current.map((v) => ({ ...v, endDate: date })));
//     };

//     const handleVenueDateSelect = (index: number, date: DateValue[]) => {
//         setVenueValues((current) =>
//             current.map((v, i) => (i === index ? { ...v, endDate: date } : v)),
//         );
//     };

//     const banApprovehandler = async () => {
//         const chosenVenues = venueValues.filter((venue) => venue.checked);

//         const venueIds = chosenVenues.map((venue) => venue.value);

//         const baseUpdateBanDto = {
//             reason: reason ? reason : ban.reason,
//             notes: notes ? notes : ban.notes,
//             isBlanketBan: allChecked,
//             status: "APPROVED" as const,
//             venueIds,
//         };

//         const updateBanDto: UpdateBanDto =
//             endDate.length !== 0
//                 ? {
//                     ...baseUpdateBanDto,
//                     endDate: dayjs(
//                         `${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`,
//                     ).toISOString(),
//                 }
//                 : baseUpdateBanDto;

//         const updateVenueBansDto: CreateVenueBansDto | undefined =
//             endDate.length === 0
//                 ? {
//                     banId: ban.id,
//                     venueDetails: chosenVenues.map((venue) => {
//                         const hasIndividualDate = venue.endDate && venue.endDate.length > 0;

//                         const resolvedEndDate = hasIndividualDate
//                             ? dayjs(
//                                 `${venue.endDate[0].year}/${venue.endDate[0].month}/${venue.endDate[0].day}`,
//                             )
//                             : dayjs(
//                                 `${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`,
//                             );

//                         return {
//                             venueId: venue.value,
//                             endDate: resolvedEndDate.toISOString(),
//                         };
//                     }),
//                 }
//                 : undefined;

//         const result = await updateBanById(ban.id, updateBanDto);

//         if (isErrorCheck(result)) {
//             toast.error("Error trying to approve ban, try again later");
//             return;
//         }

//         if (updateVenueBansDto && updateVenueBansDto.venueDetails.length > 0) {
//             const newVenueBansResult = await createNewVenueBans(updateVenueBansDto);

//             if (isErrorCheck(newVenueBansResult)) {
//                 console.log(newVenueBansResult);
//                 toast.error("Error adding individual venueBans");
//             }
//         }

//         toast.success(`Ban for ${ban.person?.name} approved sucessfully`);
//         router.invalidate();
//     };

//     return (
//         <Dialog.Root closeOnInteractOutside placement="center" size="xl">
//             <Dialog.Trigger asChild cursor="pointer">
//                 <VStack h="100%" align="flex-start" gap={2}>
//                     <Image
//                         w="full"
//                         aspectRatio={1}
//                         objectFit="cover"
//                         src={ban.person.imagePath}
//                     />
//                     <VStack
//                         w="full"
//                         alignItems="flex-start"
//                         gap={1}
//                         fontSize="small"
//                         color="gray.500"
//                     >
//                         <Text>{capitalizeString(ban.person.name)}</Text>
//                         <Text fontSize="small" color="gray.500">
//                             Uploaded by {capitalizeString(ban.createdBy.name)} on{" "}
//                             {dayjs(ban.startDate).format("DD/MM/YYYY")}
//                         </Text>
//                         <Text textTransform="capitalize">{ban.reason}</Text>
//                     </VStack>
//                 </VStack>
//             </Dialog.Trigger>
//             <Portal>
//                 <Dialog.Backdrop />
//                 <Dialog.Positioner>
//                     <Dialog.Content>
//                         <Dialog.Header>
//                             <Dialog.Title textTransform="capitalize">
//                                 Ban Details For {ban.person.name}
//                             </Dialog.Title>
//                         </Dialog.Header>
//                         <Dialog.Body>
//                             <VStack gap={8}>
//                                 <Collapsible.Root
//                                     w="full"
//                                     px={2}
//                                     borderBottomColor="blackAlpha.300"
//                                     borderWidth="1px"
//                                 >
//                                     <Collapsible.Trigger
//                                         w="full"
//                                         paddingY={0}
//                                         display="flex"
//                                         gap={2}
//                                         alignItems="center"
//                                     >
//                                         <Collapsible.Indicator
//                                             transition="transform 0.2s"
//                                             _open={{ transform: "rotate(90deg)" }}
//                                         >
//                                             <LuChevronRight />
//                                         </Collapsible.Indicator>
//                                         <Text w="full" textAlign="start" fontSize="sm">
//                                             {selectedBannedPerson
//                                                 ? selectedBannedPerson.name
//                                                 : "Select banned person here"}
//                                         </Text>
//                                         <IconButton
//                                             opacity={selectedBannedPerson ? 100 : 0}
//                                             variant="ghost"
//                                             onClick={handleClear}
//                                         >
//                                             <LiaBackspaceSolid />
//                                         </IconButton>
//                                     </Collapsible.Trigger>

//                                     <Collapsible.Content>
//                                         <Stack padding={4} gap={8}>
//                                             <Input
//                                                 placeholder="Search people"
//                                                 value={bannedPersonSearchValue}
//                                                 onChange={(e) =>
//                                                     setBannedPersonSearchValue(e.target.value)
//                                                 }
//                                             />
//                                             <RadioGroup.Root
//                                                 value={selectedBannedPerson?.id ?? ""}
//                                                 onValueChange={(e) =>
//                                                     handlePersonSelect(String(e.value))
//                                                 }
//                                             >
//                                                 <VStack w="full" gap={8}>
//                                                     {bannedPeopleFiltered.map((person) => (
//                                                         <RadioGroup.Item
//                                                             w="full"
//                                                             key={person.id}
//                                                             value={person.id}
//                                                             alignItems="center"
//                                                         >
//                                                             <RadioGroup.ItemHiddenInput />
//                                                             <RadioGroup.ItemIndicator />
//                                                             <RadioGroup.ItemText>
//                                                                 <HStack gap={4}>
//                                                                     <Avatar.Root size="lg">
//                                                                         <Avatar.Fallback name={person.name} />
//                                                                         <Avatar.Image src={person.imagePath} />
//                                                                     </Avatar.Root>
//                                                                     <Text>{capitalizeString(person.name)}</Text>
//                                                                 </HStack>
//                                                             </RadioGroup.ItemText>
//                                                         </RadioGroup.Item>
//                                                     ))}
//                                                 </VStack>
//                                             </RadioGroup.Root>
//                                         </Stack>
//                                     </Collapsible.Content>
//                                 </Collapsible.Root>

//                                 <Field.Root>
//                                     <Field.Label>
//                                         Reason <Field.RequiredIndicator />
//                                     </Field.Label>
//                                     <Input
//                                         onChange={(e) => setReason(e.target.value)}
//                                         placeholder={ban.reason}
//                                         variant="flushed"
//                                     />
//                                 </Field.Root>

//                                 <Field.Root>
//                                     <Field.Label>Notes</Field.Label>
//                                     <Input
//                                         onChange={(e) => setNotes(e.target.value)}
//                                         placeholder={!notes ? "Enter extra details here if needed" : notes}
//                                         variant="flushed"
//                                     />
//                                 </Field.Root>

//                                 <CalenderInput
//                                     selectedDate={endDate}
//                                     onDateSelect={handleGlobalDateSelect}
//                                     labelText="Ban End Date"
//                                     helperText="Entering a date here will apply it to all selected venues"
//                                 />

//                                 <Stack w="full" gap={4} align="flex-start">
//                                     <Text fontSize="sm">Ban From:</Text>
//                                     <Checkbox.Root
//                                         checked={indeterminate ? "indeterminate" : allChecked}
//                                         onCheckedChange={(e) =>
//                                             setVenueValues((current) =>
//                                                 current.map((v) => ({ ...v, checked: !!e.checked })),
//                                             )
//                                         }
//                                     >
//                                         <Checkbox.HiddenInput />
//                                         <Checkbox.Control>
//                                             <Checkbox.Indicator />
//                                         </Checkbox.Control>
//                                         <HStack w="full" align="center">
//                                             <Checkbox.Label>Blanket Ban?</Checkbox.Label>
//                                         </HStack>
//                                     </Checkbox.Root>

//                                     {venueValues.map((item, index) => (
//                                         <HStack key={item.value} w="full" align="center" px="10">
//                                             <Checkbox.Root
//                                                 checked={item.checked}
//                                                 onCheckedChange={(e) =>
//                                                     setVenueValues((current) =>
//                                                         current.map((v, i) =>
//                                                             i === index ? { ...v, checked: !!e.checked } : v,
//                                                         ),
//                                                     )
//                                                 }
//                                                 flex={1}
//                                             >
//                                                 <Checkbox.HiddenInput />
//                                                 <Checkbox.Control />
//                                                 <Checkbox.Label textTransform="capitalize">
//                                                     {item.label}
//                                                 </Checkbox.Label>
//                                             </Checkbox.Root>

//                                             <Box flex={1} textTransform="capitalize">
//                                                 <CalenderInput
//                                                     selectedDate={item.endDate}
//                                                     onDateSelect={(date) =>
//                                                         handleVenueDateSelect(index, date)
//                                                     }
//                                                     labelText=""
//                                                     helperText={`Entering a date here will apply it to only ${item.label}`}
//                                                     isDisabled={!item.checked}
//                                                 />
//                                             </Box>
//                                         </HStack>
//                                     ))}
//                                 </Stack>
//                             </VStack>
//                         </Dialog.Body>
//                         <Dialog.Footer>
//                             <Dialog.ActionTrigger asChild>
//                                 <Button colorPalette="red">Deny</Button>
//                             </Dialog.ActionTrigger>
//                             <Button disabled={noneChecked} onClick={banApprovehandler}>Approve</Button>
//                         </Dialog.Footer>
//                         <Dialog.CloseTrigger asChild>
//                             <CloseButton size="sm" />
//                         </Dialog.CloseTrigger>
//                     </Dialog.Content>
//                 </Dialog.Positioner>
//             </Portal>
//         </Dialog.Root>
//     );
// };

// export default CardPendingBan;