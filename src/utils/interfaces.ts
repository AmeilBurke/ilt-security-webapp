import type { BanDuration, BanStatus, Role } from "./enums";

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

export interface ApiRequestError {
	message: string[],
	error: string,
	statusCode: number
}

export interface VenueManager {
	id: string
	userId: string
	venueId: string
}

export interface DutyManager {
	id: string
	userId: string
	venueId: string
}

export interface Ban {
	id: string
	personId: string
	createdById: string
	reason: string
	notes?: string
	startDate: Date
	duration: BanDuration
	isBlanketBan: boolean
	status: BanStatus
}

export interface BannedPerson {
	id: string
	name: string
	imagePath: string
	bans: Ban[]
}

export interface Staff {
	id: string
	email: string
	name: string
	role: Role
	venueManagerAssignments: VenueManager[]
	dutyManagerAssignments: DutyManager[]
	bansCreated: Ban[]
}