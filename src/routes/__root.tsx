import { Box } from "@chakra-ui/react";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import { isErrorCheck } from "@/utils";
import type { IsSetupDone } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

dayjs.extend(customParseFormat);

export const Route = createRootRoute({
	beforeLoad: async ({ location }) => {
		if (
			location.pathname === "/error" ||
			location.pathname.startsWith("/create")
		) {
			return;
		}

		const result = await isSetupDone();

		const isError = isErrorCheck(result);

		if (isError) {
			if (isAxiosError(result)) {
				throw redirect({ to: "/error", search: { error: result.message } });
			}

			if (isApiRequestError(result)) {
				throw redirect({ to: "/error", search: { error: result.message[0] } });
			}
		}

		const data = result as IsSetupDone;

		if (!data.isInitialAdminCreated) {
			throw redirect({ to: "/create/admin" });
		}

		if (!data.isInitialVenueCreated) {
			throw redirect({ to: "/create/venue" });
		}
	},
	component: () => (
		<Box>
			<Outlet />
		</Box>
	),
});
