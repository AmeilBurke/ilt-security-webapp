import {
  Box,
  CloseButton,
  Field,
  FileUpload,
  IconButton,
  Input,
  InputGroup,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { LiaArrowLeftSolid } from "react-icons/lia";
import { LuFileUp } from "react-icons/lu";
import getAllBannedPeople from "@/api-requests/banned-people/getAllBannedPeople";
import ContentContainer from "@/components/ui/ContentContainer";
import { BanDuration } from "@/utils/enums";
import type { ApiRequestError, BannedPerson } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/ban")({
  component: RouteComponent,
  loader: async () => {
    const allBannedPeople: BannedPerson[] | ApiRequestError | AxiosError =
      await getAllBannedPeople();

    if (isApiRequestError(allBannedPeople) || isAxiosError(allBannedPeople)) {
      return [];
    }

    // const allVenues = await

    return allBannedPeople;
  },
});

function RouteComponent() {
  const router = useRouter();
  const allBannedPeople = Route.useLoaderData() as BannedPerson[];

  const [banImage, setBanImage] = useState<File>();
  const [Name, setName] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [Notes, setNotes] = useState<string>("");
  const [banDuration, setBanDuration] = useState<BanDuration | null>(null);

  // const [bannedPersonSearch, setBannedPersonSearch] = useState("");
  // const [selectedBannedPerson, setSelectedBannedPerson] = useState<BannedPerson | undefined>(undefined);

  // const bannedPeopleFiltered = allBannedPeople.filter((person) =>
  //   person.name.toLowerCase().includes(bannedPersonSearch.toLowerCase()),
  // );

  // const handlePersonSelect = (id: string) => {
  //   const person = allBannedPeople.find((p) => p.id === id);
  //   setSelectedBannedPerson(person);

  // };

  return (
    <ContentContainer>
      <VStack gap={8} alignItems="flex-start">
        <IconButton
          variant="ghost"
          onClick={() => router.navigate({ to: "/" })}
        >
          <LiaArrowLeftSolid />
        </IconButton>

        <VStack w="full" gap={0}>
          <Text textStyle="title">Create Ban</Text>
          <Text textStyle="muted">
            Fill in the details below to create a new ban
          </Text>
        </VStack>

        <FileUpload.Root
          onFileChange={(e) => setBanImage(e.acceptedFiles[0])}
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
            placeholder="Enter extra details here if needed"
            variant="flushed"
          />
        </Field.Root>

        <RadioGroup.Root
          value={banDuration}
          onValueChange={(e) => setBanDuration(e.value as BanDuration)}
        >
          <VStack gap="6">
            {Object.values(BanDuration).map((duration) => {
              const test = duration.toLowerCase();
              const test2 = test.split("_").map((word) => `${word} `);

              return (
                <RadioGroup.Item key={duration} value={duration}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText textTransform="capitalize">
                    {test2}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              );
            })}
          </VStack>
        </RadioGroup.Root>

        {Object.values(BanDuration).map((duration) => {
          return <Box key={duration}>{duration}</Box>;
        })}

        {/* need to add venues here */}

        {/* 
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
              Alert is for someone in system
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
    */}
      </VStack>
    </ContentContainer>
  );
}
