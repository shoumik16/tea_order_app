"use server";

import { signIn } from "@/auth";

export async function loginwithGoogle() {
    await signIn("google", { redirectTo: "/userDashboard" });
}