import type { BanStatus, Role } from "./enums";

export interface IsSetupDone {
  isInitialAdminCreated: boolean;
  isInitialVenueCreated: boolean;
}

export type DialogMode = "none" | "create" | "details" | "edit" | "delete";

export type ProfileDetailsFromJwt = {
  id: string;
  email: string;
  name: string;
  role: Role;
  iat: number;
};

export interface ApiRequestError {
  message: string[];
  error: string;
  statusCode: number;
}

export interface VenueManager {
  id: string;
  userId: string;
  venueId: string;
  staff?: Staff;
}

export interface DutyManager {
  id: string;
  userId: string;
  venueId: string;
}

export interface VenueBan {
  id: string;
  banId: string;
  venueId: string;
  ban?: Ban;
  venue?: Venue;
}

export interface BannedPerson {
  id: string;
  name: string;
  imagePath: string;
  bans?: Ban[];
  alerts?: Alert;
}

export interface Ban {
  id: string;
  personId: string;
  createdById: string;
  reason: string;
  notes?: string;
  startDate: Date;
  endDate: Date;
  isBlanketBan: boolean;
  status: BanStatus;
  venueBans: VenueBan[];
  createdBy?: {
    name: string;
  };
  person?: BannedPerson;
}

export interface Alert {
  id: string;
  personId?: string;
  reason: string;
  imagePath: string;
  startDate: Date;
  createdById: string;
  createdBy: Staff;
  bannedPerson?: BannedPerson;
}

export interface Staff {
  id: string;
  email: string;
  name: string;
  role: Role;
  venueManagerAssignments: VenueManager[];
  dutyManagerAssignments: DutyManager[];
  bansCreated: Ban[];
}

export interface Venue {
  id: string;
  name: string;
  imagePath: string;
  address: string;
  phone: string;
  venueManagers: VenueManager[];
  dutyManagers: DutyManager[];
}

export interface VenueSelection {
  label: string;
  checked: boolean;
  value: string;
}
