require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@sanity/client")
const client = createClient({ projectId: "bt6nb58h", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false })

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const TEAM = [
  // AU Team
  { id: "team-josh", name: "Josh Jebathilak", role: "Founder & Managing Director", linkedin: "https://www.linkedin.com/in/joshuajebathilak/", order: 1, img: "https://static.wixstatic.com/media/39b8ef_eaf9ebe33c49409d8a4ed2fb0f1f1bc3~mv2.jpg" },
  { id: "team-chloe", name: "Chloe Jebathilak", role: "Director of Operations", linkedin: "https://www.linkedin.com/in/chloe-jebathilak-9b3b00291/", order: 2, img: "https://static.wixstatic.com/media/39b8ef_37873b584e40443a92b8c798383a2a33~mv2.png" },
  { id: "team-aquib", name: "Aquib Zafar", role: "Director of Product Engineering", linkedin: "https://www.linkedin.com/in/aquib-zafar-521587b3/", order: 3, img: "https://static.wixstatic.com/media/d2622f_fe74688cafcb4e71956402fbcaa8e0d7~mv2.png" },
  { id: "team-ishani", name: "Ishani Chowdhury", role: "Head of Content", linkedin: "https://www.linkedin.com/in/ishani-dhar-chowdhury-2abb781a2/", order: 4, img: "https://static.wixstatic.com/media/a280a5_0bca2afb11df441e9320f112c476a7c5~mv2.jpg" },
  { id: "team-swapna", name: "Swapna Singh", role: "Implementation Lead", linkedin: "https://www.linkedin.com/in/swapnapsingh-pmp-5aa287a1/", order: 5, img: "https://static.wixstatic.com/media/a280a5_71b49fb908394eada91e4395c2b988c6~mv2.png" },
  { id: "team-natalia", name: "Natalia Mishenina", role: "Implementation Lead", linkedin: "https://www.linkedin.com/in/natalia-mishenina/", order: 6, img: "https://static.wixstatic.com/media/a280a5_e3386db3f4e04c53bb90936ff1d85fb9~mv2.jpg" },
  { id: "team-suzzane", name: "Suzzane Castro", role: "Implementation Lead", linkedin: "https://www.linkedin.com/in/suzzanecastro/", order: 7, img: "https://static.wixstatic.com/media/39b8ef_ee808863ccc54c3aa960fcc8b828e34e~mv2.jpeg" },
  { id: "team-nikki", name: "Nikki Glucksman", role: "Implementation Lead", linkedin: "https://www.linkedin.com/in/nikkiglucksman/", order: 8, img: "https://static.wixstatic.com/media/00f73d_f94a708c6c60455c92c3199acdacc96c~mv2.jpg" },
  { id: "team-ronelyn", name: "Ronelyn Tabuena", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/ronelyntabuena/", order: 9, img: "https://static.wixstatic.com/media/00f73d_00b0ed18b4ef4160939e14980f9a65a2~mv2.jpg" },
  { id: "team-yuzia", name: "Yuzia Haque", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/yuzia-haque/", order: 10, img: "https://static.wixstatic.com/media/00f73d_ef59c75704b34e6b97cc9bd59bb23ded~mv2.jpg" },
  { id: "team-annica", name: "Annica Galang", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/annica-galang-b275062ba/", order: 11, img: "https://static.wixstatic.com/media/a280a5_9de4463b9ee1401b8ccc9c0fe5d8dd2f~mv2.jpg" },
  { id: "team-julia", name: "Julia Maningas", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/julia-augustine-maningas-rpm-9a9780301/", order: 12, img: "https://static.wixstatic.com/media/a280a5_5bb2ebc58c5d4e9b98b8b40a7467fb7a~mv2.jpeg" },
  { id: "team-pierre", name: "Pierre Santos", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/ron-pierre-santos/", order: 13, img: "https://static.wixstatic.com/media/00f73d_a5c3409b70ac41a0859e34dae080a426~mv2.jpg" },
  { id: "team-tejas", name: "Tejas Singh", role: "Implementation Consultant", linkedin: "https://www.linkedin.com/in/tejas-singh-923330266/", order: 14, img: "https://static.wixstatic.com/media/00f73d_ee6a2d82d3494a9282d0d8a6792100bd~mv2.jpg" },
  { id: "team-prakriti", name: "Prakriti Chaubey", role: "Associate Automation Consultant", linkedin: "https://www.linkedin.com/in/prakritichaubey/", order: 15, img: "https://static.wixstatic.com/media/a280a5_70827cc4898e4edeb2fd140744308943~mv2.jpg" },
  { id: "team-nikhil", name: "Nikhil Tiwari", role: "Associate Automation Engineer", linkedin: "https://www.linkedin.com/in/nikhilltiwari/", order: 16, img: "https://static.wixstatic.com/media/a280a5_e30a538fae114d35a0dd62c2048e54d5~mv2.jpg" },
  { id: "team-yash", name: "Yash Khowal", role: "AI Engineer", linkedin: "https://www.linkedin.com/in/khowalyashu/", order: 17, img: "https://static.wixstatic.com/media/a280a5_3f89388e7d3a4e86811bdafc560c2356~mv2.jpeg" },
  { id: "team-branson", name: "Branson McMahon", role: "Sales Engineer Associate", linkedin: "https://www.linkedin.com/in/branson-mcmahon-2a5205235/", order: 18, img: "https://static.wixstatic.com/media/00f73d_3ac6e0328b2540148d555746be645f44~mv2.jpg" },
  { id: "team-nishkarsh", name: "Nishkarsh Hela", role: "Sales Engineer", linkedin: "https://www.linkedin.com/in/nishkarsh-hela/", order: 19, img: "https://static.wixstatic.com/media/a280a5_8fa729563ef44a16957321df2467ccdb~mv2.png" },
  { id: "team-benjie", name: "Benjie Belotindos", role: "SEO Specialist", linkedin: "https://www.linkedin.com/in/benjie-belotindos-21b255128/", order: 20, img: "https://static.wixstatic.com/media/a280a5_8dbcfff2a8634c598d60fbed4ac9f614~mv2.jpeg" },
  { id: "team-prince", name: "Prince Posadas", role: "SEO Specialist", linkedin: "https://www.linkedin.com/in/prince-ericson-m-posadas-880062231/", order: 21, img: "https://static.wixstatic.com/media/a280a5_9971dfa964594ee0a745e4fb31420e34~mv2.jpeg" },
  // UK Team
  { id: "team-ognyana", name: "Ognyana Asenova", role: "Implementation Lead", linkedin: "", order: 22, img: "https://static.wixstatic.com/media/a280a5_6323e2e6eca54542ab23841549d7eed7~mv2.jpg" },
  { id: "team-kevin-zhao", name: "Kevin Zhao", role: "Director of EMEA", linkedin: "", order: 23, img: "https://static.wixstatic.com/media/39b8ef_4bc94eadd4444cf9bdf2e6a1bdc895b1~mv2.jpeg" },
  { id: "team-bruna", name: "Bruna Alves", role: "Senior Implementation Consultant", linkedin: "", order: 24, img: "https://static.wixstatic.com/media/a280a5_607c0773135e4c3781b1a14c4e78f4f6~mv2.png" },
  { id: "team-sam", name: "Sam Karaca", role: "Implementation Consultant", linkedin: "", order: 25, img: "https://static.wixstatic.com/media/a280a5_d5ff264fc25143a0a6d773a6d7aaa026~mv2.png" },
  { id: "team-sara", name: "Sara Pereira", role: "Implementation Consultant", linkedin: "", order: 26, img: "https://static.wixstatic.com/media/00f73d_cefc3235e8c74b47b9e299d848f4c455~mv2.png" },
  // US Team
  { id: "team-zach", name: "Zach Weller", role: "Director of US", linkedin: "", order: 27, img: "https://static.wixstatic.com/media/39b8ef_0be30d752c96449e9183a6acdf79f735~mv2.jpeg" },
  { id: "team-kevin-vega", name: "Kevin Vega", role: "Implementation Consultant", linkedin: "", order: 28, img: "https://static.wixstatic.com/media/00f73d_1d3a73ac73fd4e0ba519175b84825265~mv2.png" },
  { id: "team-valeria", name: "Valeria Marin", role: "Implementation Consultant", linkedin: "", order: 29, img: "https://static.wixstatic.com/media/00f73d_670fa05cbea8464c80e24650c3c34681~mv2.jpg" },
  { id: "team-joshua-ainsbury", name: "Joshua Ainsbury", role: "Implementation Consultant", linkedin: "", order: 30, img: "https://static.wixstatic.com/media/a280a5_2e3578aa1f9c4dd58c9689a3014295ff~mv2.jpeg" },
]

async function run() {
  // Delete the 4 wrong docs
  const wrong = ["team-about", "team-industries", "team-services", "team-solutions"]
  for (const id of wrong) {
    try { await client.delete(id); console.log("Deleted", id) } catch(e) { console.log("Skip delete", id, e.message) }
    await sleep(300)
  }

  // Upsert all real team members with photos
  let done = 0
  for (const m of TEAM) {
    try {
      // Download photo
      const r = await fetch(m.img, { signal: AbortSignal.timeout(20000) })
      if (!r.ok) throw new Error("HTTP " + r.status)
      const buf = Buffer.from(await r.arrayBuffer())
      await sleep(300)
      const ext = m.img.endsWith(".png") ? "png" : m.img.endsWith(".jpeg") ? "jpeg" : "jpg"
      const asset = await client.assets.upload("image", buf, { filename: m.id + "." + ext })
      await sleep(300)
      await client.createOrReplace({
        _id: m.id,
        _type: "teamMember",
        name: m.name,
        role: m.role,
        linkedinUrl: m.linkedin || undefined,
        order: m.order,
        photo: { _type: "image", asset: { _type: "reference", _ref: asset._id } }
      })
      done++
      console.log("[" + done + "/" + TEAM.length + "] " + m.name + " done")
    } catch(e) {
      console.error("ERROR " + m.name + ": " + e.message)
    }
    await sleep(500)
  }
  console.log("\nPhase 3 complete: " + done + "/" + TEAM.length + " team members migrated")
}
run().catch(e => { console.error(e.stack); process.exit(1) })