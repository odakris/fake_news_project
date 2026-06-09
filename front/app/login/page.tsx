import LoginForm from "@/components/bsky/login-form";
import { getServerSession } from "@/lib/bsky-server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
