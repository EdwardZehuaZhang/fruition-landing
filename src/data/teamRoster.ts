// Canonical Fruition team roster sourced from monday.com board
// https://fruitionservices.monday.com/boards/1879224155 (view ALL = active only).
//
// Region codes are the site-level codes used by the team grid:
//   AU = Australia (Sydney/Melbourne)
//   SG = Singapore / Southeast Asia hub (Singapore, Philippines, Thailand)
//   IN = India
//   UK = United Kingdom / EMEA delivery (Europe / Africa / etc.)
//   US = United States / North America (incl. LATAM delivery)
//
// Regions are derived from each member's monday "Your City" + "Team"
// dropdown values so people only show up where they actually sit.
// Sanity acts as the source of truth for photo/bio/LinkedIn — this roster
// fills in monday-only members and provides region mapping for filtering.

export interface TeamRosterMember {
  /** Stable, monday board pulse id — also used as React key */
  id: string
  /** Display name shown on cards */
  name: string
  /** Job title */
  role: string
  /** Site region codes (one or many) */
  regions: string[]
  /** Optional emoji fallback when no photo is present */
  emoji?: string
  /** monday.com profile photo URL — pulled from the Person column user object. */
  photoUrl?: string
  /** Optional bio paragraph rendered under the name on the team card. */
  bio?: string
  /** Optional LinkedIn URL rendered as a card link. */
  linkedinUrl?: string
}

export const TEAM_ROSTER: TeamRosterMember[] = [
  // ---------- AU (Australia: Sydney / Melbourne) ----------
  { id: "1879225505", name: "Josh Jebathilak", role: "Founder & CEO, ex-monday.com", regions: ["APAC", "UK", "US", "IN"], emoji: "🥭", photoUrl: "https://files.monday.com/apse2/photos/42426115/original/42426115-user_photo_2025_06_07_03_59_58.png?1749268798" },
  { id: "1879224167", name: "Natalia Mishenina", role: "Implementation Lead", regions: ["APAC"], emoji: "🍎", photoUrl: "https://files.monday.com/apse2/photos/61440039/original/61440039-user_photo_2024_05_29_05_22_07.png?1716960128" },
  { id: "1998171996", name: "Branson McMahon", role: "Sales Engineer Associate", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/73582641/original/73582641-user_photo_initials_2026_03_24_04_58_14.png?1774328294" },
  { id: "5024831399", name: "Sarah Wealleans", role: "Project Manager", regions: ["APAC"], emoji: "🥝", photoUrl: "https://files.monday.com/apse2/photos/90017450/original/90017450-user_photo_2025_10_12_21_48_22.png?1760305702" },
  { id: "5024831847", name: "Swapna Singh", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/65789758/original/65789758-user_photo_2024_09_19_05_27_24.png?1726723644" },
  { id: "2653420367", name: "Shakeel Mahdhy", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/102230724/original/102230724-user_photo_initials_2026_04_15_06_40_01.png?1776235201" },
  { id: "2520030181", name: "Yash", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/97147141/original/97147141-user_photo_2025_12_26_16_16_54.png?1766765814" },
  { id: "1879226054", name: "Chloe Jebathilak", role: "Head of Marketing", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/57307280/original/57307280-user_photo_initials_2024_06_26_02_53_00.png?1719370380" },
  { id: "2595934646", name: "Alex Twigger", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/100234663/original/100234663-user_photo_initials_2026_02_24_09_39_25.png?1771925965" },
  { id: "2604975454", name: "Adam Briers", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/100523083/original/100523083-data?1772522134" },

  // ---------- SG (APAC: Singapore / Philippines / Thailand) ----------
  {
    id: "2607577824",
    name: "Edward Zehua Zhang",
    role: "Senior Web Developer",
    regions: ["APAC"],
    photoUrl: "/images/team-edward-zhang.jpg",
    linkedinUrl: "https://www.linkedin.com/in/edwardzehuazhang/",
    bio: "Edward (Zehua) Zhang is a product designer and builder based in Singapore. At Fruition his work focuses on SaaS, web products, and mobile applications — driving digital transformation and helping clients translate services, workflows, and ideas into clearer digital products. He has designed and shipped products across edtech, travel, and music.",
  },
  { id: "1879224171", name: "Suzzane Castro", role: "Regional Delivery Manager", regions: ["APAC"], emoji: "🍇", photoUrl: "https://files.monday.com/apse2/photos/60305838/original/60305838-user_photo_2026_03_19_06_38_35.png?1773902316" },
  { id: "1879227144", name: "Annica Galang", role: "Implementation Consultant", regions: ["APAC"], emoji: "🥭", photoUrl: "https://files.monday.com/apse2/photos/62852967/original/62852967-user_photo_2024_12_25_03_49_34.png?1735098574" },
  { id: "2026255901", name: "Pierre Santos", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/76520381/original/76520381-user_photo_2025_05_27_05_19_41.png?1748323181" },
  { id: "5024398238", name: "Ronelyn Tabuena", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/64567900/original/64567900-user_photo_2024_08_13_03_39_14.png?1723520354" },
  { id: "1998172332", name: "Nikki Glucksman", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/74789722/original/74789722-user_photo_2025_04_16_02_36_44.png?1744771004" },
  { id: "5024398393", name: "Thana Witchawut", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/95135535/original/95135535-user_photo_2025_10_28_07_37_33.png?1761637054" },
  { id: "5024831759", name: "Benjie Belotindos", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/82663774/original/82663774-user_photo_2025_09_09_08_04_47.png?1757405087" },
  { id: "2509839021", name: "Julia Maningas", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/96563055/original/96563055-user_photo_2025_11_20_07_01_47.png?1763622107" },
  { id: "2621762322", name: "Prince Ericson Posadas", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/100959517/original/100959517-user_photo_2026_03_14_03_46_42.png?1773460002" },

  // ---------- IN (India: New Delhi / Kolkata / Bengaluru) ----------
  { id: "1912473823", name: "Nikhil Tiwari", role: "Automation Engineer", regions: ["IN"], emoji: "🍉", photoUrl: "https://files.monday.com/apse2/photos/65603104/original/65603104-user_photo_2024_09_03_10_21_10.png?1725358874" },
  // Aquib Zafar is in Sanity but not on monday — keep here so India page renders him.
  { id: "sanity-aquib", name: "Aquib Zafar", role: "Director of Product Engineering", regions: ["IN"] },
  { id: "1998172668", name: "Prakriti Chaubey", role: "Associate Automation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/65930332/original/65930332-user_photo_2024_09_10_10_34_47.png?1725964488" },
  { id: "5024398401", name: "Yuzia Haque", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/80192959/original/80192959-user_photo_2025_08_25_09_03_30.png?1756112611" },
  { id: "5024398386", name: "Tejas Singh", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/76519931/original/76519931-user_photo_2025_05_27_05_24_42.png?1748323482" },
  { id: "5024398368", name: "Dev", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/67780780/original/67780780-user_photo_initials_2024_10_25_06_53_56.png?1729839236" },
  { id: "5024398472", name: "Nishkarsh Hela", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/88787243/original/88787243-user_photo_2025_10_22_12_56_55.png?1761137815" },
  { id: "5024832911", name: "Ishani Dhar Chowdhury", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/73277997/original/73277997-user_photo_2025_03_11_15_40_25.png?1741707625" },
  { id: "2637824216", name: "Swathi I J Singh", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://files.monday.com/apse2/photos/101581144/original/101581144-user_photo_2026_04_05_15_18_06.png?1775402286" },

  // ---------- UK / EMEA ----------
  { id: "1879226535", name: "Kevin Zhao", role: "Director of EMEA, ex-monday.com", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/62091155/original/62091155-user_photo_2024_06_29_09_18_22.png?1719652706" },
  { id: "5024398460", name: "Sara Pereira", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/80343891/original/80343891-user_photo_2025_09_22_18_55_07.png?1758567307" },
  { id: "2026255734", name: "Bruna Alves", role: "Senior Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/75830243/original/75830243-user_photo_2025_05_09_10_21_43.png?1746786103" },
  { id: "5024831831", name: "Sam Karaca", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/71476026/original/71476026-user_photo_2026_02_27_00_51_52.png?1772153512" },
  { id: "1998172556", name: "Yana Asenova", role: "Implementation Lead", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/66893860/original/66893860-user_photo_2024_10_03_03_46_19.png?1727927180" },
  { id: "2579182228", name: "Prosper (Joe) Chimombe", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/99321881/original/99321881-user_photo_2026_02_06_10_01_28.png?1770372088" },
  { id: "5024831803", name: "Joshua Ainsbury", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/95760664/original/95760664-user_photo_initials_2025_11_07_11_19_13.png?1762514353" },
  { id: "5024831809", name: "Kofi Danso", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/95760670/original/95760670-data?1762964839" },
  { id: "2520384168", name: "Mogamad Daanyaal Effendi", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/97428545/original/97428545-user_photo_2025_12_16_11_10_25.png?1765883425" },
  { id: "2601868400", name: "Alex Bordei", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/100580601/original/100580601-user_photo_2026_03_04_10_26_11.png?1772619971" },
  { id: "2657254963", name: "Robson Rosa", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/102122991/original/102122991-user_photo_2026_04_13_15_48_28.png?1776095308" },
  { id: "2657265445", name: "Nevena Gravin", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/102122169/original/102122169-user_photo_2026_04_13_13_43_42.png?1776087822" },
  { id: "2657228614", name: "Harshit Singh", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://files.monday.com/apse2/photos/102021693/original/102021693-user_photo_initials_2026_04_10_22_02_39.png?1775858559" },
  { id: "2701305395", name: "Declan Stewart", role: "Implementation Consultant", regions: ["UK"] },

  // ---------- US / North America / LATAM delivery ----------
  { id: "1879225759", name: "Zach Weller", role: "Director of North America", regions: ["US"], photoUrl: "https://files.monday.com/apse2/photos/51981029/original/51981029-user_photo_2024_02_19_21_39_28.png?1708378772" },
  { id: "5024831857", name: "Valeria Marín", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://files.monday.com/apse2/photos/75567738/original/75567738-user_photo_2025_05_07_13_41_43.png?1746625303" },
  { id: "5024831776", name: "Clarice Borges", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://files.monday.com/apse2/photos/82804844/original/82804844-user_photo_2026_05_06_21_28_47.png?1778102927" },
  { id: "2512607265", name: "Eduardo de Souza Gregianin", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://files.monday.com/apse2/photos/96700290/original/96700290-user_photo_2025_12_08_22_31_40.png?1765233101" },
  { id: "2694092322", name: "Ocea Michelin", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://files.monday.com/apse2/photos/103422108/original/103422108-user_photo_2026_05_10_21_52_15.png?1778449935" },
]
