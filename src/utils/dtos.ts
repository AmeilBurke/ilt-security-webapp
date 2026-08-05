import type { BanStatus, Role } from "./enums";

export interface CreateStaffDto {
  email: string;
  password: string;
  name: string;
  role: Role;
  venueManagerAssignments?: string[];
  dutyManagerAssignments?: string[];
}

export type CreateAlertDto = {
  reason: string;
  personId?: string;
  imagePath?: string;
};

export interface CreateVenueBansDto {
  banId: string;
  venueDetails: {
    venueId: string;
    endDate: string;
  }[];
}

export type CreateBanDto = {
  personId: string;
  reason: string;
  notes?: string;
  startDate: string;
  endDate: string;
  isBlanketBan: boolean;
  venueIds: string[];
};

export type UpdateBanDto = {
  personId?: string;
  reason?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  isBlanketBan?: boolean;
  status?: BanStatus;
  venueIds?: string[];
};
