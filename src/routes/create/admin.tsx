import { Button, Field, Input } from "@chakra-ui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import getJwt from "@/api-requests/authentication/getJwt";
import createNewStaff from "@/api-requests/staff/createNewStaff";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import PageCreate from "@/components/pages/PageCreate";
import { PasswordInput } from "@/components/ui/password-input";
import { handleApiResult } from "@/utils";
import type { IsSetupDone } from "@/utils/interfaces";
import createAdminImage from "../../assets/create-admin.png";

export const Route = createFileRoute("/create/admin")({
	beforeLoad: async () => {
		const result = await isSetupDone();

		if (isAxiosError(result)) {
			throw redirect({ to: "/error", search: { error: result.message } });
		}

		const data = result.data as IsSetupDone;

		if (data.isInitialAdminCreated) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const createAdminHandler = async () => {
		if (!email || !name) {
			toast.error("Email and name are required");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			setPassword("");
			setConfirmPassword("");
			return;
		}

		setLoading(true);

		try {
			const createAdminResult = await createNewStaff({
				email,
				name,
				password,
				role: "ADMIN",
			});
			if (!handleApiResult(createAdminResult, router)) return;

			const jwtResult = await getJwt(email, password);
			if (!handleApiResult(jwtResult, router)) return;

			localStorage.setItem("jwt", jwtResult.data.access_token);

			toast.success(createAdminResult.data);
			router.navigate({ to: "/create/venue" });
		} catch (error) {
			router.navigate({
				to: "/error",
				search: { error: JSON.stringify(error) },
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

			<Field.Root required>
				<Field.Label>
					Confirm Password <Field.RequiredIndicator />
				</Field.Label>
				<PasswordInput
					value={confirmPassword}
					placeholder="Confirm password"
					onChange={(e) => setConfirmPassword(e.target.value)}
					variant="flushed"
				/>
			</Field.Root>
		</>
	);

	const button = (
		<Button
			disabled={
				email === "" || name === "" || password === "" || confirmPassword === ""
			}
			onClick={createAdminHandler}
			loading={loading}
		>
			Create Account
		</Button>
	);

	return (
		<PageCreate
			heading="Let's Get Started"
			subText="Create an admin account"
			inputs={inputs}
			button={button}
			imagePath={createAdminImage}
		/>
	);
}
