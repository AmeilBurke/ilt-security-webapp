import {
    HStack,
    IconButton,
    Image,
    Menu,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { CiMenuKebab } from "react-icons/ci";
import { capitalizeString } from "@/utils";
import { Role } from "@/utils/enums";
import type { Alert } from "@/utils/interfaces";

type CardAlertProps = {
    alert: Alert;
    onSelectAlert: (alert: Alert) => void;
    userRole: Role;
};

const CardAlert = ({ alert, onSelectAlert, userRole }: CardAlertProps) => {
    return (
        <VStack h="100%" align="flex-start" gap={2}>
            <Image w="full" aspectRatio={1} objectFit="cover" src={alert.imagePath} />
            <VStack w="full" alignItems="flex-start" gap={1}>
                <HStack w="full" justifyContent={"space-between"}>
                    <Text>{capitalizeString(alert.reason)}</Text>
                    {userRole !== Role.ADMIN ? null : (
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <IconButton variant="ghost">
                                    <CiMenuKebab />
                                </IconButton>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        {/* <Menu.Item
                                            value="edit"
                                            onClick={() => onEditAlert(alert)}
                                        >
                                            Edit...
                                        </Menu.Item> */}
                                        <Menu.Item
                                            value="delete"
                                            onClick={() => onSelectAlert(alert)}
                                        >
                                            Delete...
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    )}
                </HStack>
                <Text fontSize="small" color="gray.500">
                    Uploaded by {capitalizeString(alert.createdBy.name)} @{" "}
                    {dayjs(alert.startDate).format("hh:mm a")}
                </Text>
            </VStack>
        </VStack>
    );
};

export default CardAlert;
