import { redirect } from 'next/navigation'

/**
 * The Clockify upload now lives at the top of New Invoice, which is otherwise
 * the same form. Kept as a redirect so existing links and bookmarks still land
 * somewhere sensible.
 */
export default function ClockifyImportPage() {
  redirect('/internal/invoices/new')
}
