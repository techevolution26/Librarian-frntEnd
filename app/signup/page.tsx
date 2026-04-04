import SignupPageClient from "./SignupPageClient";

interface SignupPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : {};
  const next = params.next ?? "/library";

  return <SignupPageClient nextPath={next} />;
}