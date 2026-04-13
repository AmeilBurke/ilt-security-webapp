import { Button, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { capitalizeString } from "@/utils";
import type { Alert } from "@/utils/interfaces";

const PageAlerts = ({ alerts }: { alerts: Alert[] }) => {
	const router = useRouter();

	return (
		<VStack w="full" gap={4} >
			<Button w="full" onClick={() => router.navigate({ to: "/create-alert" })}>
				Create New Alert
			</Button>

			{alerts.length === 0 ? (
				<Text w="full">No alerts have been uploaded</Text>
			) : (
				<SimpleGrid w="full" columns={{ base: 2, lg: 4 }} gap={8}>
					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}					{alerts.map((alert) => (
						<VStack key={alert.id} h="100%" align="flex-start" gap={2}>
							<Image
								h="20vh"
								aspectRatio={1}
								objectFit="cover"
								src={alert.imagePath}
							/>
							<VStack alignItems="flex-start" gap={0}>
								<Text>{capitalizeString(alert.reason)}</Text>
								<Text fontSize="small" color="gray.500">
									Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
									{dayjs(alert.startDate).format("hh:mm:A")}
								</Text>
							</VStack>
						</VStack>
					))}
				</SimpleGrid>
			)}
		</VStack>
	);
};

export default PageAlerts;
