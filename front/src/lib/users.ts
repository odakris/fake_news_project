import { headers } from "next/headers";
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation";
import { User } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function requireUserSession(): Promise<User> {
    const user = await auth.api.getSession({
        headers: await headers(),
    });
    if (!user?.user) {
        return notFound();
    }
    return user.user as User;
}

export async function getUserByAtprotoHandle(atprotoHandle: User["handle"]): Promise<User | null> {
    if (!atprotoHandle) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
            handle: atprotoHandle,
        },
    });
    return user;
}