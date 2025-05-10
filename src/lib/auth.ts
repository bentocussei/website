import { NextAuthOptions, User as NextAuthUser, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { logActivity } from "@/lib/activityLogger";

interface ExtendedNextAuthUser extends NextAuthUser {
  id: string;
  isAdmin: boolean;
}

interface ExtendedJWT extends JWT {
  id?: string;
  isAdmin?: boolean;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/paitrabalhou",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ipAddress = req.headers?.["x-forwarded-for"] || req.headers?.["x-real-ip"] || null;
        const userAgent = req.headers?.["user-agent"] || null;

        if (!credentials?.email || !credentials?.password) {
          await logActivity({
            action: "LOGIN_FAILED_MISSING_CREDENTIALS",
            details: { email: credentials?.email || "N/A" },
            ipAddress,
            userAgent,
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          await logActivity({
            action: "LOGIN_FAILED_USER_NOT_FOUND",
            details: { email: credentials.email },
            ipAddress,
            userAgent,
          });
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          await logActivity({
            userId: user.id,
            action: "LOGIN_FAILED_PASSWORD_INCORRECT",
            details: { email: credentials.email },
            ipAddress,
            userAgent,
          });
          return null;
        }

        if (!user.isAdmin) {
          await logActivity({
            userId: user.id,
            action: "LOGIN_FAILED_NOT_ADMIN",
            details: { email: credentials.email },
            ipAddress,
            userAgent,
          });
          return null;
        }
        
        await logActivity({
            userId: user.id,
            action: "USER_LOGIN_SUCCESS",
            details: { email: user.email },
            ipAddress,
            userAgent,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          isAdmin: user.isAdmin,
        } as ExtendedNextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user?: ExtendedNextAuthUser; account?: Account | null; profile?: Profile | null; trigger?: "signIn" | "signUp" | "update" | "jwt" | undefined; isNewUser?: boolean | undefined; session?: any; }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: ExtendedJWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
}; 