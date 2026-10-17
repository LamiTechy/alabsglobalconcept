export const leadStatusEnum = [
  "new",
  "contacted",
  "site_survey",
  "quoted",
  "won",
  "lost",
] as const;

export const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_survey: "Site Survey",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const propertyLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  institutional: "Institutional",
  estate: "Estate",
  other: "Other",
};
