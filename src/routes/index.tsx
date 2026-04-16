import { Tabs, Text, useTabs } from "@chakra-ui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { LiaExclamationSolid } from "react-icons/lia";
import { LuSquareCheck } from "react-icons/lu";
import getAllAlerts from "@/api-requests/alerts/getAllAlerts";
import getProfileFromJwt from "@/api-requests/authentication/getProfileFromJwt";
import getAllBlanketBannedPeople from "@/api-requests/banned-people/getAllBlanketBannedPeople";
import getAllWithPendingBan from "@/api-requests/banned-people/getAllWithPendingBan";
import getAllStaff from "@/api-requests/staff/getAllStaff";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import PageAlerts from "@/components/pages/PageAlerts";
import PageBlanketBannedPeople from "@/components/pages/PageBlanketBannedPeople";
import PagePendingBans from "@/components/pages/PagePendingBans";
import PageStaff from "@/components/pages/PageStaff";
import PageVenues from "@/components/pages/PageVenues";
import ContentContainer from "@/components/ui/ContentContainer";
import { capitalizeString } from "@/utils";
import type { Staff } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const jwtToken = localStorage.getItem("jwt");

		if (!jwtToken) {
			throw redirect({ to: "/sign-in" });
		}

		const result = await getProfileFromJwt(jwtToken);

		if (isApiRequestError(result) || isAxiosError(result)) {
			throw redirect({ to: "/sign-in" });
		}

		return { staff: result.data as Staff };
	},
	loader: async () => {
		const [alerts, pendingBans, blanketBanned, venues, staff] =
			await Promise.all([
				getAllAlerts(),
				getAllWithPendingBan(),
				getAllBlanketBannedPeople(),
				getAllVenues(),
				getAllStaff(),
			]);
		return { alerts, pendingBans, blanketBanned, venues, staff };
	},
	component: () => {
		const tabs = useTabs({
			defaultValue: "Alerts",
		});

		const { staff: user } = Route.useRouteContext();
		const { alerts, pendingBans, blanketBanned, venues, staff } =
			Route.useLoaderData();

		return (
			<ContentContainer>
				<Text textStyle="title">Dashboard - {tabs.value}</Text>
				<Text textStyle="muted">Welcome {capitalizeString(user.name)}</Text>
				<Tabs.Root defaultValue="alerts">
					<Tabs.List overflowX="auto" whiteSpace="nowrap"  >
						<Tabs.Trigger value="alerts" flexShrink={0} overflowY="hidden" >
							<LiaExclamationSolid />
							Alerts
						</Tabs.Trigger>
						{user.role === "ADMIN" ? (
							<Tabs.Trigger value="pending-bans" flexShrink={0}>
								<LiaExclamationSolid />
								Pending Bans
							</Tabs.Trigger>
						) : null}
						<Tabs.Trigger value="blanket-banned" flexShrink={0}>
							<LuSquareCheck />
							Blanket Banned People
						</Tabs.Trigger>
						<Tabs.Trigger value="venues" flexShrink={0}>
							<LuSquareCheck />
							Venues
						</Tabs.Trigger>
						<Tabs.Trigger value="staff" flexShrink={0}>
							<LuSquareCheck />
							Staff
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="alerts">
						{isApiRequestError(alerts) || isAxiosError(alerts) ? (
							<Text>Cannot fetch alerts</Text>
						) : (
							<PageAlerts alerts={alerts} />
						)}
					</Tabs.Content>

					<Tabs.Content value="pending-bans">
						{isApiRequestError(pendingBans) || isAxiosError(pendingBans) ? (
							<Text>Cannot fetch pending bans</Text>
						) : (
							<PagePendingBans pendingBans={pendingBans} />
						)}
					</Tabs.Content>

					<Tabs.Content value="blanket-banned">
						{isApiRequestError(blanketBanned) || isAxiosError(blanketBanned) ? (
							<Text>Cannot fetch blanket bans</Text>
						) : (
							<PageBlanketBannedPeople blanketBanned={blanketBanned} />
						)}
					</Tabs.Content>

					<Tabs.Content value="venues">
						{isApiRequestError(venues) || isAxiosError(venues) ? (
							<Text>Cannot fetch venues</Text>
						) : (
							<PageVenues venues={venues} />
						)}
					</Tabs.Content>
					<Tabs.Content value="staff">
						{isApiRequestError(staff) || isAxiosError(staff) ? (
							<Text>Cannot fetch staff</Text>
						) : (
							<PageStaff staff={staff} />
						)}
					</Tabs.Content>
				</Tabs.Root>
			</ContentContainer>
		);
	},
});
