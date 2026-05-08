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
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import createNewStaff from "@/api-requests/staff/createNewStaff";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageCreate from "@/components/pages/PageCreate";
import { PasswordInput } from "@/components/ui/password-input";
import { capitalizeString, isErrorCheck } from "@/utils";
import { Role } from "@/utils/enums";
import type { CreateStaffDto, Venue } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

// Moved outside component — no dependency on props or state
const allRoles = Object.entries(Role).map(([key, value]) => ({
  key: key as Role,
  label: value.replace("_", " ").toLowerCase(),
}));

const requiresVenueAssignment = (role: Role | null) =>
  role === Role.VENUE_MANAGER || role === Role.DUTY_MANAGER;

export const Route = createFileRoute("/create/staff")({
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roleValue, setRoleValue] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  // Lazy initializer — allVenues won't change, so no need to recompute on every render
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

  const createStaffHandler = async () => {
    const errors = [
      !email && "Missing email",
      !password && "Missing password",
      !name && "Missing name",
      !roleValue && "Missing role",
      requiresVenueAssignment(roleValue) &&
      noneChecked &&
      "Select at least one venue to add the account to",
    ].filter(Boolean) as string[];

    if (errors.length > 0) {
      toast.error(errors.join("\n\n"));
      return;
    }

    if (!roleValue) return;

    const venueIds = venueValues.filter((v) => v.checked).map((v) => v.value);

    const createStaffDto: CreateStaffDto = {
      email,
      password,
      name,
      role: roleValue,
      ...(roleValue === Role.VENUE_MANAGER && {
        venueManagerAssignments: venueIds,
      }),
      ...(roleValue === Role.DUTY_MANAGER && {
        dutyManagerAssignments: venueIds,
      }),
    };

    setLoading(true);
    try {
      const result = await createNewStaff(createStaffDto);

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

      toast.success("Account was created");
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
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          variant="flushed"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>
          Name <Field.RequiredIndicator />
        </Field.Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Text fontSize="sm" fontWeight="semibold">
          Role:
        </Text>
        <RadioGroup.Root
          value={roleValue}
          onValueChange={(e) => setRoleValue(e.value as Role)}
        >
          <VStack gap={6} alignItems="flex-start">
            {allRoles.map((item) => (
              <RadioGroup.Item key={item.key} value={item.key}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  {item.label}
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </VStack>
        </RadioGroup.Root>
      </Stack>

      {requiresVenueAssignment(roleValue) && (
        <Stack w="full" gap={4} align="flex-start">
          <Text fontSize="sm">Venues:</Text>
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
            <Checkbox.Label>Add To All Venues</Checkbox.Label>
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
      )}
    </>
  );

  const button = (
    <Button
      disabled={!email || !password || !name || !roleValue}
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
