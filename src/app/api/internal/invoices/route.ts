import { getPortalApiUser, getPortalAdmin } from '@/lib/portalAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from('fruition_invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch invoices:', error)
    // Portal is auth-gated to the Workspace domain, so pass the real Postgres
    // message through — a silent 500 hid a missing table for weeks.
    return NextResponse.json(
      { error: 'Failed to fetch invoices: ' + error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from('fruition_invoices')
    .insert({
      user_id: user.id,
      invoice_no: body.invoice_no,
      invoice_date: body.invoice_date,
      billing_month: body.billing_month || null,
      billing_period: body.billing_period,
      currency: body.currency || 'USD',
      consultant_name: body.consultant_name,
      consultant_address: body.consultant_address || '',
      consultant_phone: body.consultant_phone || '',
      consultant_email: body.consultant_email || '',
      wise_name: body.wise_name || '',
      wise_tag: body.wise_tag || '',
      billing_address: body.billing_address || '',
      notes: body.notes || '',
      line_items: body.line_items || [],
      region: body.region || 'APAC',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice: ' + error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}
