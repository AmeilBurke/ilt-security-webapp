import {
  Button,
  Checkbox,
  Field,
  Input,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import createNewStaff from "@/api-requests/staff/createNewStaff";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageCreate from "@/components/pages/PageCreate";
import { PasswordInput } from "@/components/ui/password-input";
import { capitalizeString } from "@/utils";
import { Role } from "@/utils/enums";
import type {
  ApiRequestError,
  CreateStaffDto,
  Venue,
} from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/create/staff")({
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

//need to clean up logic

function RouteComponent() {
  const router = useRouter();
  const allVenues = Route.useLoaderData() as Venue[];
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [roleValue, setRoleValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const allRoles = Object.entries(Role).map(([key, value]) => {
    const test = {
      key: key,
      value: String(value).toLowerCase(),
    };

    if (value.includes("_")) {
      test.value = value.replace("_", " ").toLowerCase();
    }

    return test;
  });

  const roleInitialValues = allRoles.map((role) => {
    return {
      label: role.value,
      checked: false,
      value: role.key,
    };
  });

  const allVenueValues = allVenues.map((venue) => {
    return {
      label: venue.name,
      checked: false,
      value: venue.id,
    };
  });

  const [venueValues, setVenueValues] = useState(allVenueValues);

  const allChecked = venueValues.every((value) => value.checked);
  const noneChecked = venueValues.every((value) => !value.checked);
  const indeterminate =
    venueValues.some((value) => value.checked) && !allChecked;

  const createStaffHandler = async () => {
    if (
      (roleValue === Role.VENUE_MANAGER || roleValue === Role.DUTY_MANAGER) &&
      noneChecked
    ) {
      toast.error("Select at least one venue to add the account to");
      return;
    }

    const createStaffDto: CreateStaffDto = {
      email: email,
      password: password,
      name: name,
      role: Role[roleValue as keyof typeof Role],
    };

    const venueIds = venueValues
      .filter((value) => value.checked)
      .map((value) => value.value);

    console.log(venueIds)

    console.log(Role[roleValue as keyof typeof Role] === Role.VENUE_MANAGER)
    if (Role[roleValue as keyof typeof Role] === Role.VENUE_MANAGER) {
      createStaffDto.venueManagerAssignments = venueIds;
    }

    if (Role[roleValue as keyof typeof Role] === Role.DUTY_MANAGER) {
      createStaffDto.dutyManagerAssignments = venueIds;
    }

    setLoading(true);

    const result = await createNewStaff(createStaffDto);
    console.log(result)

    setLoading(false);

    if (isApiRequestError(result)) {
      toast.error(
        `Failed to create account because:\n - ${capitalizeString(result.message.join(`\n`))}`,
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
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter name"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Password <Field.RequiredIndicator />
        </Field.Label>
        <PasswordInput
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          variant="flushed"
        />
      </Field.Root>

      <Stack w="full" gap={4} align="flex-start">
        <Text fontSize="sm">Role:</Text>

        <RadioGroup.Root
          value={roleValue}
          onValueChange={(e) => setRoleValue(e.value)}
        >
          <VStack gap="6">
            {roleInitialValues.map((item) => (
              <RadioGroup.Item key={item.value} value={item.value}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText textTransform="capitalize">
                  {item.label}
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </VStack>
        </RadioGroup.Root>
      </Stack>

      {roleValue !== "VENUE_MANAGER" && roleValue !== "DUTY_MANAGER" ? null : (
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
            <Checkbox.Label>Add To All Venues</Checkbox.Label>
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
      )}
    </>
  );

  const button = (
    <Button
      disabled={
        email === "" || password === "" || name === "" || roleValue === null
      }
      onClick={createStaffHandler}
      loading={loading}
    >
      Create New Staff
    </Button>
  );

  return (
    <PageCreate
      heading="Create New Staff"
      subText="Fill out the details below to create a new staff account"
      inputs={inputs}
      button={button}
    />
  );
}
