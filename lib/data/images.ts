/**
 * Demo imagery from Unsplash & Pexels (free licenses, all URLs verified 200).
 * Swap for owned photography before launch — see CONTENT_TODO.md.
 */
export function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export function pexels(id: number | string, w = 1200) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

export const IMAGES = {
  hero: unsplash("photo-1509391366360-2e959784a276", 1600),
  whyUs: pexels(9875441, 1200),
  aboutStory: pexels(4254167, 1200),
  serviceSidebar: unsplash("photo-1548337138-e87d889cc369", 800),
  cctv: pexels(17440970, 1200),
  cctvSidebar: pexels(3205735, 800),
  team: [
    unsplash("photo-1581092918056-0c4c3acd3789", 600),
    unsplash("photo-1560250097-0b93528c311a", 600),
    unsplash("photo-1573496359142-b8d87734a5a2", 600),
    unsplash("photo-1519085360753-af0119f7cbe7", 600),
  ],
  products: {
    panel550: pexels(356036, 800),
    panel450: pexels(2800832, 800),
    inverter5: pexels(8853502, 800),
    inverter10: pexels(9875434, 800),
    batteryLithium: unsplash("photo-1521618755572-156ae0cdd74d", 800),
    batteryTubular: unsplash("photo-1497435334941-8c899ee9e8e9", 800),
    kit3: unsplash("photo-1559302504-64aae6ca6b6d", 800),
    kit5: unsplash("photo-1497440001374-f26997328c1b", 800),
    kit10: `https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=800`,
    streetLight: unsplash("photo-1473341304170-971dccb5ac1e", 800),
    mppt: pexels(1108572, 800),
    accessories: pexels(433308, 800),
    cctvBullet: pexels(3205735, 800),
    cctvDome: pexels(29148355, 800),
    cctvKit: unsplash("photo-1557597774-9d273605dfa9", 800),
  },
  projects: {
    gwarinpa: unsplash("photo-1497440001374-f26997328c1b", 1000),
    clinic: unsplash("photo-1497366216548-37526070297c", 1000),
    office: unsplash("photo-1497366216548-37526070297c", 1000),
    street: unsplash("photo-1473341304170-971dccb5ac1e", 1000),
    shop: unsplash("photo-1441986300917-64674bd600d8", 1000),
    farm: unsplash("photo-1500382017468-9049fed747ef", 1000),
  },
  blog: {
    sizing: unsplash("photo-1466611653911-95081537e5b7", 1000),
    batteries: unsplash("photo-1521618755572-156ae0cdd74d", 1000),
    vsGenerator: unsplash("photo-1509390144018-eeaf65052242", 1000),
  },
} as const;
