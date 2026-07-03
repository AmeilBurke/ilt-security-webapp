import {
    Avatar,
    Collapsible,
    HStack,
    IconButton,
    Input,
    RadioGroup,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LiaBackspaceSolid } from "react-icons/lia";
import { LuChevronRight } from "react-icons/lu";
import { capitalizeString } from "@/utils";
import type { BannedPerson } from "@/utils/interfaces";

export type BannedPersonSelectorProps = {
    bannedPeople: BannedPerson[];
    selectedBannedPerson: BannedPerson | undefined;
    onSelectedBannedPerson: (person: BannedPerson | undefined) => void;
    onSetAlertImage: (file: File | undefined) => void;
    bannedPersonSearch: string;
    onSetBannedPersonSearch: (searchValue: string) => void;
    labelText: string;
    originalSelectedBannedPerson?: BannedPerson;
};

const ComponentBannedPersonSelector = ({
    bannedPeople,
    selectedBannedPerson,
    onSelectedBannedPerson,
    onSetAlertImage,
    bannedPersonSearch,
    onSetBannedPersonSearch,
    labelText,
    originalSelectedBannedPerson,
}: BannedPersonSelectorProps) => {


    const handleClear = () => {
        onSetBannedPersonSearch("");

        if (originalSelectedBannedPerson) {
            onSelectedBannedPerson(originalSelectedBannedPerson)
        } else {
            onSelectedBannedPerson(undefined);
        }
    };

    const handlePersonSelect = (id: string) => {
        const person = bannedPeople.find((p) => p.id === id);
        onSelectedBannedPerson(person);
        onSetAlertImage(undefined);
    };

    const bannedPeopleFiltered = bannedPeople.filter((person) =>
        person.name.toLowerCase().includes(bannedPersonSearch.toLowerCase()),
    );

    return (
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
                        ? capitalizeString(selectedBannedPerson.name)
                        : labelText}
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
                        onChange={(e) => onSetBannedPersonSearch(e.target.value)}
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
    );
};

export default ComponentBannedPersonSelector;
