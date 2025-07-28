import { getServerSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter as Prisma } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import googleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { get } from "http";


export const authOptions : NextAuthOptions = {
    adapter: Prisma(db),
    session: { strategy: "jwt" },
    pages : {
        signIn: "/sign-in",
    },
    providers: [
        googleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.name = token.name
                session.user.image = token.picture
                session.user.username = token.username
            }
            return session;
        },
        async jwt({ token, user }) {   
            const dbUser = await db.user.findUnique({
                where: {
                    email: token.email ?? undefined,
                },
            })

            if(!dbUser) {
                token.id = user!.id;
                return token;
            }

            if(!dbUser.username) {
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(10),
                    },
                })
            }

            return{
                id:dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                picture: dbUser.image,
                username: dbUser.username,
            }
        },
        redirect() {
            return "/";
        }
    },
    
}

export const getAuthSession =() => getServerSession(authOptions)