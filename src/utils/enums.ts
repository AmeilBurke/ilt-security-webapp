export const Role = {
  ADMIN: "ADMIN",
  VENUE_MANAGER: "VENUE_MANAGER",
  DUTY_MANAGER: "DUTY_MANAGER",
  BOUNCER: "BOUNCER",
} as const;

export type Role = typeof Role[keyof typeof Role];