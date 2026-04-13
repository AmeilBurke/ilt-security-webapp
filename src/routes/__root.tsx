import { Box } from "@chakra-ui/react";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import type { IsSetupDone } from "@/utils/interfaces";

export const Route = createRootRoute({
	beforeLoad: async ({ location }) => {
		if (
			location.pathname === "/error" ||
			location.pathname.startsWith("/initial-setup")
		)
			return;

		const result = await isSetupDone();

		if (isAxiosError(result)) {
			throw redirect({ to: "/error" });
		}

		const data = result.data as IsSetupDone;

		if (!data.isInitialAdminCreated) {
			throw redirect({ to: "/initial-setup/create-admin" });
		}

		if (!data.isInitialVenueCreated) {
			throw redirect({ to: "/initial-setup/create-venue" });
		}
	},
	component: () => (
		<Box>
			<Outlet />
		</Box>
	),
});
