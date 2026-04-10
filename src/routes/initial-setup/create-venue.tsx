// initial-setup/create-venue.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import isSetupDone from "@/api-requests/staff/isSetupDone";
import type { IsSetupDone } from "@/utils/interfaces";

export const Route = createFileRoute("/initial-setup/create-venue")({
    beforeLoad: async () => {
        const result = await isSetupDone();

        if (isAxiosError(result)) {
            throw redirect({ to: "/error" });
        }

        const data = result.data as IsSetupDone;

        if (!data.isInitialAdminCreated) {
            throw redirect({ to: "/initial-setup/create-admin" });
        }

        if (data.isInitialVenueCreated) {
            throw redirect({ to: "/" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/initial-setup/create-venue"!</div>
}