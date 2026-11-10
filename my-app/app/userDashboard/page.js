
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
console.log(session);
console.log("cccccc");
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Welcome, {session.user.name}</h1>

      <p>{session.user.email}</p>

      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/login",
          });
        }}
      >
        <button type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
