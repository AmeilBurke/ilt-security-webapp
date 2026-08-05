import type { DateValue } from "@chakra-ui/react";
import type { useRouter } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import updateBanById from "@/api-requests/ban/updateBanById";
import type { UpdateBanDto } from "./dtos";
import type { ApiRequestError, Ban, Venue, VenueSelection } from "./interfaces";
import { isApiRequestError } from "./isApiRequestError";

export const capitalizeString = (textToCapitalize: string) => {
  return textToCapitalize
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const isErrorCheck = (result: unknown): result is AxiosError | ApiRequestError => {
  return isAxiosError(result) || isApiRequestError(result);
};

export const handleEditBanDetailUpdate = async (
  selectedBan: Ban,
  venueSelectionValues: VenueSelection[],
  reason: string,
  endDate: DateValue[],
  allChecked: boolean,
  onDialogClose: () => void,
  router: ReturnType<typeof useRouter>,
  notes?: string,
) => {
  if (!selectedBan) {
    return;
  }

  const venueIdsToBanFrom = venueSelectionValues
    .filter((venue) => {
      return venue.checked;
    })
    .map((value) => {
      return value.value;
    });

  const updateBanDto: UpdateBanDto = {
    reason: reason || selectedBan?.reason,
    notes: notes || selectedBan?.notes,
    endDate:
      endDate.length !== 0
        ? dayjs.utc(`${endDate[0].year}/${endDate[0].month}/${endDate[0].day}`).toISOString()
        : undefined,
    isBlanketBan: allChecked,
    venueIds: venueIdsToBanFrom,
  };

  const result = await updateBanById(selectedBan.id, updateBanDto);

  if (isErrorCheck(result)) {
    toast.error("Could not approve pending ban, try again later");
    return;
  }

  toast.success("Ban updated successfully");
  // handleEditBanDetailDialogClose();
  // setIsBanDetailsDialogOpen(false);

  onDialogClose();
  router.invalidate();
};

export const areAllVenueSelectionValuesChecked = (venueSelection: VenueSelection[]) => {
  return venueSelection.every((v) => v.checked);
};

export const areAllVenueSelectionValuesIndeterminate = (
  venueSelection: VenueSelection[],
  allChecked: boolean,
) => {
  return venueSelection.some((v) => v.checked) && !allChecked;
};

export const convertVenuesToVenueSelectionValues = (ban: Ban, venues: Venue[]): VenueSelection[] => {
  if (!ban.venueBans) {
    return [];
  }

  const bannedVenueIds = new Set(ban.venueBans.map((venueBan) => venueBan.venueId));

  return venues.map((venue) => {
    return {
      label: venue.name,
      checked: bannedVenueIds.has(venue.id),
      value: venue.id,
    };
  });
};