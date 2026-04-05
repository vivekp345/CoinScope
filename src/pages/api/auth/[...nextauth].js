// src/pages/api/auth/[...nextauth].js
export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await dbConnect();

        // ✅ .select("+password") — password is select:false by default
        // Without this, user.password is undefined and bcrypt.compare() fails
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+password");

        if (!user) {
          throw new Error("No account found with this email");
        }

        // ✅ Now user.password is available for comparison
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
        };
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error:  "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug:  process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);