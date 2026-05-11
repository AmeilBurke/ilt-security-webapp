import type { DateValue } from "@chakra-ui/react";
import type { BanStatus, Role } from "./enums";

export interface IsSetupDone {
	isInitialAdminCreated: boolean;
	isInitialVenueCreated: boolean;
}

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

export type CreateBanDto = {
	personId: string;
	reason: string;
	notes?: string;
	startDate: string;
	endDate: string;
	isBlanketBan: boolean;
	venueIds: string[];
}

export type UpdateBanDto = {
	personId?: string;
	reason?: string;
	notes?: string;
	startDate?: string;
	endDate?: string;
	isBlanketBan?: boolean;
	status?: BanStatus;
	venueIds?: string[];
}

export type ProfileDetailsFromJwt = {
	id: string,
	email: string,
	name: string,
	role: Role,
	iat: number
}


export interface ApiRequestError {
	message: string[];
	error: string;
	statusCode: number;
}

export interface VenueManager {
	id: string;
	userId: string;
	venueId: string;
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
	endDate: string;
}

export interface CreateVenueBansDto {
	banId: string,
	venueDetails: {
		venueId: string,
		endDate: string,
	}[]
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
	createdBy?: {
		name: string
	},
	person?: {
		id: string;
		name: string;
		imagePath: string;
	},
	venueBans?: VenueBan[]
}

export interface PendingBan extends Ban {
	createdBy: {
		name: string
	},
	person: {
		id: string;
		name: string;
		imagePath: string;
	},
	venueBans: VenueBan[]
}

export interface BanWithVenueBans {
	id: string;
	personId: string;
	createdById: string;
	reason: string;
	notes?: string;
	startDate: Date;
	endDate: Date;
	isBlanketBan: boolean;
	status: BanStatus;
	venueBans: VenueBan[]
}


export interface BannedPerson {
	id: string;
	name: string;
	imagePath: string;
	bans: Ban[];
	alerts: Alert[];
}

export interface BannedPersonWithVenueBans {
	id: string;
	name: string;
	imagePath: string;
	bans: BanWithVenueBans[];
	alerts: Alert[];
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

export interface Alert {
	id: string;
	personId: number | null;
	reason: string;
	imagePath: string;
	startDate: string;
	createdById: string;
	createdBy: {
		name: string;
	};
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
	endDate: DateValue[];
}
