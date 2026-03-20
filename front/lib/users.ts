import { headers } from "next/headers";
import { auth } from "./auth"
import { notFound } from "next/navigation";
import { User } from "./generated/prisma/client";
import { prisma } from "./prisma";

export async function requireUserSession(): Promise<User> {
    const user = await auth.api.getSession({
        headers: await headers(),
    });
    if (!user?.user) {
        return notFound();
    }
    return user.user as User;
}

export async function getUserByAtprotoHandle(atprotoHandle: User["atprotoHandle"]): Promise<User | null> {
    if (!atprotoHandle) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
            atprotoHandle: atprotoHandle,
        },
    });
    return user;
}