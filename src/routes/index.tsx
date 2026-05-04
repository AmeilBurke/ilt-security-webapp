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
import TabAlerts from "@/components/pages/TabAlerts";
import TabBans from "@/components/pages/TabBans";
import TabBlanketBans from "@/components/pages/TabBlanketBans";
import TabPendingBans from "@/components/pages/TabPendingBans";
import TabStaff from "@/components/pages/TabStaff";
import TabVenues from "@/components/pages/TabVenues";
import ContentContainer from "@/components/ui/ContentContainer";
import { capitalizeString } from "@/utils";
import type { Staff } from "@/utils/interfaces";
import { isApiRequestError } from "@/utils/isApiRequestError";

export const Route = createFileRoute("/")({
	errorComponent: ({ error }) => <div>{String(error)}</div>,
	beforeLoad: async () => {
		const jwtToken = localStorage.getItem("jwt");

		if (!jwtToken) {
			throw redirect({ to: "/sign-in" });
		}

		const result = await getProfileFromJwt();
		console.log(result);

		if (isApiRequestError(result) || isAxiosError(result)) {
			throw redirect({ to: "/sign-in" });
		}

		return { staff: result.data as Staff };
	},
	loader: async () => {
		const [alerts, pendingBans, blanketBans, venues, staff] = await Promise.all(
			[
				getAllAlerts(),
				getAllWithPendingBan(),
				getAllBlanketBannedPeople(),
				getAllVenues(),
				getAllStaff(),
			],
		);

		return { alerts, pendingBans, blanketBans, venues, staff };
	},
	component: () => {
		const tabs = useTabs({
			defaultValue: "alerts",
		});

		const { staff: user } = Route.useRouteContext();
		const { alerts, pendingBans, blanketBans, venues, staff } =
			Route.useLoaderData();

		return (
			<ContentContainer>
				<Text textStyle="title" textTransform="capitalize">
					Dashboard - {tabs.value}
				</Text>
				<Text textStyle="muted">Welcome {capitalizeString(user.name)}</Text>
				<Tabs.Root defaultValue="alerts">
					<Tabs.List overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
						<Tabs.Trigger value="alerts" flexShrink={0} overflowY="hidden">
							<LiaExclamationSolid />
							Alerts
						</Tabs.Trigger>
						{user.role === "ADMIN" ? (
							<Tabs.Trigger value="pending-bans" flexShrink={0}>
								<LiaExclamationSolid />
								Pending Bans
							</Tabs.Trigger>
						) : null}
						<Tabs.Trigger value="bans" flexShrink={0}>
							<LuSquareCheck />
							Bans
						</Tabs.Trigger>
						<Tabs.Trigger value="blanket-bans" flexShrink={0}>
							<LuSquareCheck />
							Blanket Bans
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
							<TabAlerts alerts={alerts} />
						)}
					</Tabs.Content>

					<Tabs.Content value="pending-bans">
						{isApiRequestError(pendingBans) || isAxiosError(pendingBans) ? (
							<Text>Cannot fetch pending bans</Text>
						) : (
							<TabPendingBans pendingBans={pendingBans} />
						)}
					</Tabs.Content>

					<Tabs.Content value="bans">
						<TabBans />
					</Tabs.Content>

					<Tabs.Content value="blanket-bans">
						{isApiRequestError(blanketBans) || isAxiosError(blanketBans) ? (
							<Text>Cannot fetch pending bans</Text>
						) : (
							<TabBlanketBans blanketBans={blanketBans} />
						)}
					</Tabs.Content>

					<Tabs.Content value="venues">
						{isApiRequestError(venues) || isAxiosError(venues) ? (
							<Text>Cannot fetch venues</Text>
						) : (
							<TabVenues venues={venues} />
						)}
					</Tabs.Content>
					<Tabs.Content value="staff">
						{isApiRequestError(staff) || isAxiosError(staff) ? (
							<Text>Cannot fetch staff</Text>
						) : (
							<TabStaff staff={staff} />
						)}
					</Tabs.Content>
				</Tabs.Root>
			</ContentContainer>
		);
	},
});
