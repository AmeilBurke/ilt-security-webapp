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
import { useState } from "react";
import { LiaBackspaceSolid } from "react-icons/lia";
import { LuChevronRight } from "react-icons/lu";
import { capitalizeString } from "@/utils";
import type { BannedPerson } from "@/utils/interfaces";

type BannedPersonSelectorProps = {
    selectedBannedPerson: BannedPerson,
    originalSelectedBannedPerson: BannedPerson,
    onBannedPersonSelect: (bannedPerson: BannedPerson) => void,
    allBanned: BannedPerson[]
}

const BannedPersonSelector = ({ selectedBannedPerson, originalSelectedBannedPerson, onBannedPersonSelect, allBanned }: BannedPersonSelectorProps) => {
    const [searchValue, setSearchValue] = useState("");

    const handleClear = () => {
        onBannedPersonSelect(originalSelectedBannedPerson)
    }

    const handlePersonSelect = (id: string) => {
        const person = allBanned.find((person) => person.id === id);
        if (person) {
            onBannedPersonSelect(person)
        }
    };

    const bannedPeopleFiltered = allBanned.filter((person) =>
        person.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
        <Collapsible.Root
            w="full"
            px={2}
            borderBottomColor="blackAlpha.300"
            borderWidth="1px"
        >

            <HStack>
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



                </Collapsible.Trigger>

                {/* {selectedBannedPerson.id !== originalSelectedBannedPerson.id && (
                    <IconButton
                        variant="ghost"
                        onClick={handleClear}
                    >
                        <LiaBackspaceSolid />
                    </IconButton>
                )} */}

                <IconButton
                    variant="ghost"
                    onClick={handleClear}
                >
                    <LiaBackspaceSolid />
                </IconButton>
            </HStack>

            <Collapsible.Content>
                <Stack padding={4} gap={8}>
                    <Input
                        placeholder="Search people"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
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
        </Collapsible.Root >
    );
};

export default BannedPersonSelector;
