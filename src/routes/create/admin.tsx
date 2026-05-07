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
import { capitalizeString, isErrorCheck } from "@/utils";
import type { IsSetupDone } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";
import createAdminImage from "../../assets/create-admin.png";

export const Route = createFileRoute("/create/admin")({
	beforeLoad: async () => {
		const result = await isSetupDone();

		if (isErrorCheck(result)) {
			throw redirect({ to: "/error", search: { error: "Cannot get needed information from server" } });
		}

		const data = result as IsSetupDone;

		if (data.isInitialAdminCreated) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

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

			if (isAxiosError(createAdminResult)) {
				router.navigate({
					to: "/error",
					search: { error: createAdminResult.message },
				});
				return;
			}

			if (isApiRequestError(createAdminResult)) {
				router.navigate({
					to: "/error",
					search: {
						error: capitalizeString(createAdminResult.error),
					},
				});
				return;
			}

			const jwtResult = await getJwt(email, password);

			if (isAxiosError(jwtResult)) {
				router.navigate({
					to: "/error",
					search: { error: jwtResult.message },
				});
				return;
			}

			if (isApiRequestError(jwtResult)) {
				router.navigate({
					to: "/error",
					search: {
						error: capitalizeString(jwtResult.message.join(", ")),
					},
				});
				return;
			}

			localStorage.setItem("jwt", jwtResult.access_token);

			toast.success(createAdminResult);
			router.navigate({ to: "/create/venue" });
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