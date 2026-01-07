import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                const email = credentials?.email?.toString().trim().toLowerCase();
                const password = credentials?.password?.toString();

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return null;

                return { id: user.id, email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/", // ta page login
    },
};
