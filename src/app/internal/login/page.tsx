import LoginScreen from "@/components/internal/LoginScreen"

interface SearchParams {
  next?: string
  error?: string
  notice?: string
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  return <LoginScreen next={sp.next} error={sp.error} notice={sp.notice} />
}
