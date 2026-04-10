import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import createNewStaff from "@/api-requests/staff/createNewStaff";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import { PasswordInput } from "@/components/ui/password-input";
import { capitilizeString } from "@/utils";
import type { CreateStaffDto, IsSetupDone } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";
import createAdmin from "../../assets/create-admin.png";

export const Route = createFileRoute("/initial-setup/create-admin")({
  beforeLoad: async () => {
    const result = await isSetupDone();

    if (isAxiosError(result)) {
      throw redirect({ to: "/error" });
    }

    const data = result.data as IsSetupDone;

    if (data.isInitialAdminCreated) {
      throw redirect({ to: "/initial-setup/create-venue" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createAdminHandler = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const requestData: CreateStaffDto = {
      email: email,
      name: name,
      password: password,
      role: "ADMIN",
    };

    setLoading(true)

    const result = await createNewStaff(requestData);

    setLoading(false)

    if (isApiRequestError(result)) {
      toast.error(
        `Failed to create an admin account because:\n - ${capitilizeString(result.message.join("\n"))}`,
      );
      return;
    }

    if (isAxiosError(result)) {
      router.navigate({ to: '/error' })
      return
    }

    toast.success(result.data);
    router.navigate({ to: '/initial-setup/create-venue' })
    return
  };

  return (
    <HStack h="100svh" justifyContent="space-between">
      <VStack p={8} flex={2} gap={8} alignItems={'flex-start'} >
        <Box>
          <Heading textStyle='title' >Let's Get Started</Heading>
          <Text textStyle='muted' >Create an admin account</Text>
        </Box>

        <VStack w="full" gap={8} >

          <Field.Root required>
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={name}
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            ></Input>
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Confirm Password <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field.Root>
        </VStack>
        <Button
          disabled={
            email === "" ||
            name === "" ||
            password === "" ||
            confirmPassword === ""
          }
          onClick={createAdminHandler}
          loading={loading}
        >
          Create Account
        </Button>
      </VStack>
      <Image display={['none', null, 'block']} flex={1} h="100svh" src={createAdmin}></Image>
    </HStack>
  );
}
