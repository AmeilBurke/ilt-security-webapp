import type { Role } from "./enums";

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
