import {
  Avatar,
  Button,
  CloseButton,
  Collapsible,
  Field,
  FileUpload,
  HStack,
  IconButton,
  Input,
  InputGroup,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { LiaArrowLeftSolid, LiaBackspaceSolid } from "react-icons/lia";
import { LuChevronRight, LuFileUp } from "react-icons/lu";
import createNewAlert from "@/api-requests/alerts/createNewAlert";
import getAllBannedPeople from "@/api-requests/banned-people/getAllBannedPeople";
import ContentContainer from "@/components/ui/ContentContainer";
import { capitalizeString } from "@/utils";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/alert")({
  component: RouteComponent,
  loader: async () => {
    const allBannedPeople: BannedPerson[] | ApiRequestError | AxiosError =
      await getAllBannedPeople();

    if (isApiRequestError(allBannedPeople) || isAxiosError(allBannedPeople)) {
      return [];
    }


    const allBannedPeopleWithoutAlerts = allBannedPeople.filter((person) => {
      console.log(person)
      return person.alerts.length === 0
    })
    return allBannedPeopleWithoutAlerts;
  },
});

function RouteComponent() {
  const router = useRouter();
  const allBannedPeople = Route.useLoaderData() as BannedPerson[];

  const [bannedPersonSearch, setBannedPersonSearch] = useState("");
  const [selectedBannedPerson, setSelectedBannedPerson] = useState<
    BannedPerson | undefined
  >(undefined);
  const [alertImage, setAlertImage] = useState<File>();
  const [reason, setReason] = useState<string>("");

  const bannedPeopleFiltered = allBannedPeople.filter((person) =>
    person.name.toLowerCase().includes(bannedPersonSearch.toLowerCase()),
  );

  const handlePersonSelect = (id: string) => {
    const person = allBannedPeople.find((p) => p.id === id);
    setSelectedBannedPerson(person);
    setAlertImage(undefined);
  };

  const handleClear = () => {
    setSelectedBannedPerson(undefined);
    setBannedPersonSearch("");
  };

  const uploadAlertHandler = async () => {
    const alertDto = new FormData();

    alertDto.append("reason", reason);

    if (alertImage && !selectedBannedPerson) {
      alertDto.append("image", alertImage);
    }

    if (selectedBannedPerson) {
      alertDto.append("personId", selectedBannedPerson.id);
    }

    const result = await createNewAlert(alertDto);

    if (isApiRequestError(result) || isAxiosError(result)) {
      toast.error("Error");
      console.log(result);
      return;
    }

    toast.success(`Alert created`);

    setBannedPersonSearch("");
    setSelectedBannedPerson(undefined);
    setAlertImage(undefined);
    setReason("");

    router.navigate({ to: "/" });
    return;
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

        <VStack w="full" gap={0} >
          <Text textStyle="title">Create Alert</Text>
          <Text textStyle="muted">Fill in the details below to create an alert</Text>
        </VStack>
        {
          allBannedPeople.every((person) => { return person.alerts.length === 1 })
            ? null
            : <Collapsible.Root w="full" px={2} borderBottomColor='blackAlpha.300' borderWidth='1px'>
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
                <Text w="full" textAlign="start" fontSize='sm' >
                  {selectedBannedPerson
                    ? capitalizeString(selectedBannedPerson.name)
                    : "Alert is for someone in system"}
                </Text>

                <IconButton opacity={selectedBannedPerson ? 100 : 0} variant="ghost" onClick={handleClear}>
                  <LiaBackspaceSolid />
                </IconButton>
              </Collapsible.Trigger>

              <Collapsible.Content>
                <Stack padding={4} gap={8} >
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
        }

        {selectedBannedPerson !== undefined ? null : (
          <FileUpload.Root
            onFileChange={(e) => setAlertImage(e.acceptedFiles[0])}
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
        )}

        <Field.Root required>
          <Field.Label>
            Reason <Field.RequiredIndicator />
          </Field.Label>
          <Input
            onChange={(event) => setReason(event.target.value)}
            placeholder="Enter reason for alert"
            variant="flushed"
          />
        </Field.Root>

        <Button
          disabled={
            reason === "" ||
            (selectedBannedPerson === undefined && alertImage === undefined)
          }
          onClick={uploadAlertHandler}
          w="full"
        >
          Upload Alert
        </Button>
      </VStack>
    </ContentContainer>
  );
}
