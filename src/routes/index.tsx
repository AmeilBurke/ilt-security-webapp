import { Tabs, Text } from "@chakra-ui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { LiaExclamationSolid } from "react-icons/lia";
import { LuSquareCheck } from "react-icons/lu";
import getAllAlerts from "@/api-requests/alerts/getAllAlerts";
import getProfileFromJwt from "@/api-requests/authentication/getProfileFromJwt";
import getAllWithPendingBan from "@/api-requests/ban/getAllPendingBans";
import getAllBannedPeople from "@/api-requests/banned-people/getAllBannedPeople";
import getAllBlanketBannedPeople from "@/api-requests/banned-people/getAllBlanketBannedPeople";
import getAllStaff from "@/api-requests/staff/getAllStaff";
import getAllVenues from "@/api-requests/venues/getAllVenues";
import TabAlerts from "@/components/pages/TabAlerts";
import TabBans from "@/components/pages/TabBans";
import TabBlanketBans from "@/components/pages/TabBlanketBans";
import TabPendingBans from "@/components/pages/TabPendingBans";
import TabStaff from "@/components/pages/TabStaff";
import TabVenues from "@/components/pages/TabVenues";
import ContentContainer from "@/components/ui/ContentContainer";
import { capitalizeString, isErrorCheck } from "@/utils";
import { Role } from "@/utils/enums";
import type { ProfileDetailsFromJwt } from "@/utils/interfaces";
export const Route = createFileRoute("/")({
	errorComponent: ({ error }) => <div>{String(error)}</div>,
	beforeLoad: async () => {
		const jwtToken = localStorage.getItem("jwt");

		if (!jwtToken) {
			throw redirect({ to: "/sign-in" });
		}

		const result = await getProfileFromJwt();
		const isError = isErrorCheck(result);

		if (isError) {
			throw redirect({ to: "/sign-in" });
		}

		return { staff: result as ProfileDetailsFromJwt };
	},
	loader: async () => {
		const [alerts, pendingBans, blanketBans, venues, staff, allBanned] =
			await Promise.all([
				getAllAlerts(),
				getAllWithPendingBan(),
				getAllBlanketBannedPeople(),
				getAllVenues(),
				getAllStaff(),
				getAllBannedPeople(),
			]);

		return { alerts, pendingBans, blanketBans, venues, staff, allBanned };
	},
	component: () => {
		const { staff: user } = Route.useRouteContext();
		const { alerts, pendingBans, blanketBans, venues, staff, allBanned } = Route.useLoaderData();
		const [activeTab, setActiveTab] = useState("alerts");

		function TabError({ message }: { message: string }) {
			return <Text>Cannot fetch {message}</Text>;
		}

		return (
			<ContentContainer>
				<Text textStyle="title" textTransform="capitalize">Dashboard - {activeTab}</Text>
				<Text textStyle="muted">Welcome {capitalizeString(user.name)}</Text>

				<Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
					<Tabs.List overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
						<Tabs.Trigger value="alerts" flexShrink={0} overflowY="hidden"><LiaExclamationSolid />Alerts</Tabs.Trigger>
						{
							user.role === Role.ADMIN
								? <Tabs.Trigger value="pending bans" flexShrink={0}><LiaExclamationSolid />Pending Bans</Tabs.Trigger>
								: null
						}
						<Tabs.Trigger value="bans" flexShrink={0}><LuSquareCheck />Bans</Tabs.Trigger>
						<Tabs.Trigger value="blanket bans" flexShrink={0}><LuSquareCheck />Blanket Bans</Tabs.Trigger>
						<Tabs.Trigger value="venues" flexShrink={0}><LuSquareCheck />Venues</Tabs.Trigger>
						<Tabs.Trigger value="staff" flexShrink={0}><LuSquareCheck />Staff</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="alerts">
						{
							isErrorCheck(alerts)
								? <TabError message="Cannot fetch alerts" />
								: <TabAlerts alerts={alerts} userRole={user.role} />
						}
					</Tabs.Content>

					<Tabs.Content value="pending bans">
						{
							user.role !== Role.ADMIN || isErrorCheck(pendingBans) || isErrorCheck(venues) || isErrorCheck(allBanned)
								? <TabError message="Cannot fetch pending bans" />
								: <TabPendingBans pendingBans={pendingBans} venues={venues} allBanned={allBanned} />
						}
					</Tabs.Content>

					<Tabs.Content value="bans">
						{
							isErrorCheck(allBanned)
							? <TabError message="Cannot fetch bans" />
							: <TabBans allBanned={allBanned} />
						}
					</Tabs.Content>

					<Tabs.Content value="blanket bans">
						{
							isErrorCheck(blanketBans)
								? <TabError message="Cannot fetch blanket bans" />
								: <TabBlanketBans blanketBans={blanketBans} />
						}
					</Tabs.Content>

					<Tabs.Content value="venues">
						{
							isErrorCheck(venues)
								? <TabError message="Cannot fetch venues" />
								: <TabVenues venues={venues} />
						}
					</Tabs.Content>
					<Tabs.Content value="staff">
						{
							isErrorCheck(staff)
								? <TabError message="Cannot fetch staff" />
								: <TabStaff staff={staff} />
						}
					</Tabs.Content>
				</Tabs.Root>
			</ContentContainer>
		);
	},
});
