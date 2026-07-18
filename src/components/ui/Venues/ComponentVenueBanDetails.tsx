import { Badge, DataList, HStack, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Ban } from "@/utils/interfaces";
import VStackGapMid from "../VStackGapMid";

export type ComponentBanDetailsProps = {
  bans: Ban[] | undefined;
  // userRole: Role;
  // onHandleEditBanDetailDialogOpen: (selectedPerson: BannedPerson) => void;
};

const ComponentVenueBanDetails = ({
  bans,
  // userRole,
  // onHandleEditBanDetailDialogOpen,
}: ComponentBanDetailsProps) => {
  if (!bans) {
    return null;
  }

  return (
    <VStackGapMid>
      {bans.map((ban, index) => (
        <HStack
          key={ban.id}
          w="full"
          p={4}
          bg={index % 2 === 0 ? "gray.100" : undefined}
        >
          <DataList.Root
            w="full"
            alignItems="start"
            gap={8}
            orientation="horizontal"
          >
            <DataList.Item>
              <DataList.ItemLabel>Reason</DataList.ItemLabel>
              <DataList.ItemValue>{ban.reason}</DataList.ItemValue>
            </DataList.Item>

            <DataList.Item>
              <DataList.ItemLabel>Ban Started</DataList.ItemLabel>
              <DataList.ItemValue>
                {dayjs(ban.startDate).format("DD MMM YYYY")}
              </DataList.ItemValue>
            </DataList.Item>

            <DataList.Item>
              <DataList.ItemLabel>Banned Ends</DataList.ItemLabel>
              <DataList.ItemValue>
                <HStack gap={4}>{dayjs(ban.endDate).format("DD MMM YYYY")} {dayjs(ban.endDate).isAfter(dayjs()) ? <Badge colorPalette="red">BAN ACTIVE</Badge> : <Badge>BAN EXPIRED</Badge>}</HStack>
              </DataList.ItemValue>
            </DataList.Item>

            <DataList.Item alignItems="flex-start">
              <DataList.ItemLabel>Banned From</DataList.ItemLabel>
              <DataList.ItemValue>
                <VStack alignItems="flex-start">
                  {ban.venueBans.map((venueBan) =>
                    venueBan.venue?.name ? (
                      <Text key={venueBan.id}>- {venueBan.venue.name}</Text>
                    ) : null,
                  )}
                </VStack>
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
          {/* {
            userRole === Role.ADMIN && (
              <Button alignSelf="flex-end" onClick={() => onHandleEditBanDetailDialogOpen(ban)}>
                Edit Details
              </Button>
            )
          } */}
        </HStack>
      ))}
    </VStackGapMid>
  );
};

export default ComponentVenueBanDetails;
