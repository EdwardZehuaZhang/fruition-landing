require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@sanity/client")
const client = createClient({ projectId: "bt6nb58h", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false })
client.fetch('*[_type == "teamMember"]{ _id, name, role, bio }').then(r => console.log(JSON.stringify(r, null, 2))).catch(e => console.error(e.message))