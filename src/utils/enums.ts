export const Role = {
	ADMIN: "ADMIN",
	VENUE_MANAGER: "VENUE_MANAGER",
	DUTY_MANAGER: "DUTY_MANAGER",
	BOUNCER: "BOUNCER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const BanStatus = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	DENIED: "DENIED",
	EXPIRED: "EXPIRED",
} as const;

export type BanStatus = (typeof BanStatus)[keyof typeof BanStatus];
