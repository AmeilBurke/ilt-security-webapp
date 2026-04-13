import { Text } from "@chakra-ui/react";
import type { Alert } from "@/utils/interfaces";

const PageAlerts = ({ alerts }: { alerts: Alert[] }) => {
	return (
		<>
			{alerts.map((alert) => {
				return (
					<Text key={alert.id}>
						{alert.id} : {alert.reason}
					</Text>
				);
			})}
		</>
	);
};

export default PageAlerts;
