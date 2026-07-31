import { writeClient } from './sanity-migrate/lib'
async function main() {
  const nav = await writeClient.fetch(`*[_type == "siteSettings"][0].navigation`)
  console.log(JSON.stringify(nav, null, 1))
}
main()
