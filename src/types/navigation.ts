export type PageId =
  | "home"
  | "about"
  | "trainer"
  | "plans"
  | "exercises"
  | "muscle-fatloss"
  | "coaching"
  | "calculator"
  | "tracking"
  | "gallery"
  | "transformations"
  | "reviews"
  | "membership"
  | "contact"
  | "admin"
  | "attendance";

export interface NavItem {
  id: PageId;
  label: string;
  shortLabel?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "trainer", label: "Head Coach" },
  { id: "plans", label: "Workout Plans" },
  { id: "exercises", label: "Exercise Library" },
  { id: "coaching", label: "Personal Coaching" },
  { id: "calculator", label: "Calorie Calculator" },
  { id: "gallery", label: "Gym Gallery" },
  { id: "membership", label: "Membership" },
  { id: "contact", label: "Contact & Location" },
];
