import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import type { IsSetupDone } from "@/utils/intrefaces";

export const Route = createRootRoute({
    beforeLoad: async () => {
        const result = await isSetupDone();

        if (isAxiosError(result)) {
            throw redirect({ to: "/error" });
        }

        const data = result.data as IsSetupDone

        if (!data.isInitialAdminCreated) {
            throw redirect({ to: "/intial-setup/create-admin" });
        }

        if (!data.isInitialVenueCreated) {
            throw redirect({ to: "/intial-setup/create-venue" });
        }
    },
    component: () => <Outlet />,
});
