import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// unset the wrongly-seeded heroProductImages so it stays empty
const r = await client
  .patch('mondayImplementationConsultantsPage')
  .unset(['heroProductImages'])
  .commit()
console.log('unset OK', r._rev)
