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
  { id: "1879225505", name: "Josh Jebathilak", role: "Founder & CEO, ex-monday.com", regions: ["APAC", "UK", "US", "IN"], emoji: "🥭", photoUrl: "https://avatars.slack-edge.com/2023-11-27/6263149572353_c61c7bebd59907d8ec96_512.png" },
  { id: "1998171996", name: "Branson McMahon", role: "Sales Engineer Associate", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2026-04-02/10833300331986_368b5867e1068f2482bd_512.jpg" },
  { id: "5024831399", name: "Sarah Wealleans", role: "Project Manager", regions: ["APAC"], emoji: "🥝", photoUrl: "https://avatars.slack-edge.com/2025-10-13/9712137442384_798afc8d24a6d84c17dd_512.png" },
  { id: "5024831847", name: "Swapna Singh", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-01-21/8335572173521_36d9f325e1860470297b_512.jpg" },
  { id: "2653420367", name: "Shakeel Mahdhy", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://secure.gravatar.com/avatar/555479367a537c4aaf11fd19babff283.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0005-512.png" },
  { id: "2520030181", name: "Yash", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-12-19/10159938495780_c739a06cb3dc50784d34_512.jpg" },
  { id: "1879226054", name: "Chloe Jebathilak", role: "Head of Marketing", regions: ["APAC"], photoUrl: "https://files.monday.com/apse2/photos/57307280/original/57307280-user_photo_initials_2024_06_26_02_53_00.png?1719370380" },
  { id: "2595934646", name: "Alex Twigger", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2026-03-03/10612970406675_c8de8790b03169f28ad5_512.jpg" },
  { id: "2604975454", name: "Adam Briers", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2026-03-02/10618149537938_96fbcdc19d63c228b138_512.png" },

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
  { id: "1879224171", name: "Suzzane Castro", role: "Regional Delivery Manager", regions: ["APAC"], emoji: "🍇", photoUrl: "https://avatars.slack-edge.com/2026-02-26/10617907859920_d590ad0b698cf401a85d_512.png" },
  { id: "1879227144", name: "Annica Galang", role: "Implementation Consultant", regions: ["APAC"], emoji: "🥭", photoUrl: "https://avatars.slack-edge.com/2024-12-25/8241923908384_0294f4f8612a56a975b1_512.jpg" },
  { id: "2026255901", name: "Pierre Santos", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-05-27/8956541066706_bb96beeb7f8d7e9df9fa_512.jpg" },
  { id: "5024398238", name: "Ronelyn Tabuena", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2024-08-13/7578809289889_7ba202c4e8bc8f81a860_512.png" },
  { id: "1998172332", name: "Nikki Glucksman", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-04-12/8747940339380_c12730d70b28769f4c7a_512.jpg" },
  { id: "5024398393", name: "Thana Witchawut", role: "Implementation Lead", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-10-28/9778914572803_04471f305b0e71a7a674_512.jpg" },
  { id: "5024831759", name: "Benjie Belotindos", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-09-09/9511891541120_1e4ccd9fb1f4846b157d_512.jpg" },
  { id: "2509839021", name: "Julia Maningas", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2025-11-20/9985611562256_27a797ab6a102af42aa7_512.jpg" },
  { id: "2621762322", name: "Prince Ericson Posadas", role: "Implementation Consultant", regions: ["APAC"], photoUrl: "https://avatars.slack-edge.com/2026-04-16/10930139273332_680c2761e630bccca5e2_512.jpg" },

  // ---------- IN (India: New Delhi / Kolkata / Bengaluru) ----------
  { id: "1912473823", name: "Nikhil Tiwari", role: "Automation Engineer", regions: ["IN"], emoji: "🍉", photoUrl: "https://avatars.slack-edge.com/2024-09-03/7654133382087_5713a25b99c947c9b0a4_512.jpg" },
  { id: "1998172668", name: "Prakriti Chaubey", role: "Associate Automation Consultant", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2026-03-03/10649754211856_29ac90a32ed507f142dc_512.png" },
  { id: "5024398401", name: "Yuzia Haque", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2026-04-27/11005912596082_a6bedf7a0d66b04a8a01_512.jpg" },
  { id: "5024398386", name: "Tejas Singh", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2025-10-15/9703426262498_670bdc75e23b315c9e66_512.jpg" },
  { id: "5024398368", name: "Dev", role: "Implementation Consultant", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2026-03-29/10794975507667_e67b1b72b14505c3681b_512.jpg" },
  { id: "5024398472", name: "Nishkarsh Hela", role: "Sales Engineer (Asia)", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2025-09-26/9573514980583_79e60c9fc45fe09e72f3_512.png" },
  { id: "5024832911", name: "Ishani Dhar Chowdhury", role: "Head of Content", regions: ["IN"], photoUrl: "https://avatars.slack-edge.com/2025-03-11/8586736062564_fa134d8b2af9d98a0339_512.jpg" },
  { id: "2637824216", name: "Swathi I J Singh", role: "Implementation Consultant", regions: ["IN"], photoUrl: "/images/team-swathi.jpg" },

  // ---------- UK / EMEA ----------
  { id: "1879226535", name: "Kevin Zhao", role: "UK Lead", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2024-06-18/7294792037844_1fd3b83a90b519835f15_512.jpg" },
  { id: "5024398460", name: "Sara Pereira", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2025-08-25/9404148905154_ec6b647d74a8720c47a5_512.png" },
  { id: "2026255734", name: "Bruna Alves", role: "Senior Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2025-04-17/8772405410884_212e741fe39d6c1145b4_512.png" },
  { id: "5024831831", name: "Sam Karaca", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-02-18/10521279766711_ee2a42bb415f87707ec5_512.png" },
  { id: "1998172556", name: "Yana Asenova", role: "Implementation Lead", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-02-17/10554837102704_b488438aaee5c117c8a8_512.png" },
  { id: "2579182228", name: "Prosper (Joe) Chimombe", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-02-06/10460079658212_90bae2d3f9f2c15b2adf_512.png" },
  { id: "5024831803", name: "Joshua Ainsbury", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2025-11-11/9884904339589_f1cf0c14366b8ff07ced_512.jpg" },
  { id: "5024831809", name: "Kofi Danso", role: "Solutions", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-02-23/10554690779027_6623af520ddfb8e78fbd_512.jpg" },
  { id: "2520384168", name: "Mogamad Daanyaal Effendi", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-01-01/10216231518466_800fd83829e5809dc34a_512.png" },
  { id: "2601868400", name: "Alex Bordei", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-04-23/10995789595841_c6d86c29bd4769b1e55d_512.png" },
  { id: "2657254963", name: "Robson Rosa", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-04-13/10900335656773_e51fe5335e80c2b2454a_512.jpg" },
  { id: "2657265445", name: "Nevena Gravin", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-04-13/10901996683218_93f261f7d8eaa9b5584a_512.jpg" },
  { id: "2657228614", name: "Harshit Singh", role: "Implementation Consultant", regions: ["UK"], photoUrl: "https://avatars.slack-edge.com/2026-04-13/10901631657154_b69de97a4edd9a49a621_512.png" },
  { id: "2701305395", name: "Declan Stewart", role: "Implementation Consultant", regions: ["UK"], photoUrl: "/images/team-declan.png" },

  // ---------- US / North America / LATAM delivery ----------
  { id: "1879225759", name: "Zach Weller", role: "Director of North America", regions: ["US"], photoUrl: "https://avatars.slack-edge.com/2025-06-15/9053311496148_b2c1f5b8b147f7017318_512.png" },
  { id: "5024831857", name: "Valeria Marín", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://avatars.slack-edge.com/2025-05-04/8831313334263_6587e61ea1d5ee42098e_512.jpg" },
  { id: "5024831776", name: "Clarice Borges", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://avatars.slack-edge.com/2026-04-24/10992884589858_4210de199a8833b9444a_512.png" },
  { id: "2512607265", name: "Eduardo de Souza Gregianin", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://avatars.slack-edge.com/2025-11-24/9985101301218_9f7b6ed221bc1d551aa4_512.jpg" },
  { id: "2694092322", name: "Ocea Michelin", role: "Implementation Consultant", regions: ["US"], photoUrl: "https://avatars.slack-edge.com/2026-05-12/11140179347456_ff89c682a3e1a7b62c2d_512.jpg" },
]
