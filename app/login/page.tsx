import LoginPageClient from "./LoginPageClient";

interface LoginPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const next = params.next ?? "/library";

  return <LoginPageClient nextPath={next} />;
}