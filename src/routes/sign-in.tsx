import { Button, Field, Input } from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import getJwt from "@/api-requests/authentication/getJwt";
import ComponentInitialSetup from "@/components/pages/ComponentInitialSetup";
import { PasswordInput } from "@/components/ui/password-input";
import { handleApiResult } from "@/utils";
import signInImage from "../assets/sign-in.webp";

export const Route = createFileRoute("/sign-in")({
	component: RouteComponent,
	beforeLoad: () => {
		localStorage.removeItem("jwt");
	},
});

function RouteComponent() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const signInHandler = async () => {
		setLoading(true);

		try {
			const jwtResult = await getJwt(email, password);
			if (!handleApiResult(jwtResult, router)) return;

			localStorage.setItem("jwt", jwtResult.data.access_token);
			toast.success("Sign in successful");
			router.navigate({ to: "/" });
		} catch (error) {
			console.log(error)
			router.navigate({ to: "/error", search: { error: error } });
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
					Password <Field.RequiredIndicator />
				</Field.Label>
				<PasswordInput
					value={password}
					placeholder="Enter password"
					onChange={(e) => setPassword(e.target.value)}
					variant="flushed"
				/>
			</Field.Root>
		</>
	);

	const button = (
		<Button
			disabled={email === "" || password === ""}
			onClick={signInHandler}
			loading={loading}
		>
			Sign In
		</Button>
	);

	return (
		<ComponentInitialSetup
			heading="Sign In"
			subText="Enter your details to sign in"
			inputs={inputs}
			button={button}
			imagePath={signInImage}
		/>
	);
}
