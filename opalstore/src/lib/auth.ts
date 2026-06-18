import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { connectDB } from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Create a MongoClient for the adapter
const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        // Find user with password field (select: false by default)
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+password");

        if (!user) return null;

        // Google-only users don't have a password
        if (!user.password) return null;

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.email.includes("admin") ? "admin" : "user",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Save/update user in our custom User model on every sign in
      if (user?.email) {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { email: user.email },
            {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              image: user.image || "",
              provider: account?.provider || "credentials",
              providerId: account?.providerAccountId || "",
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error("Error saving user:", err);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.id = user.id;
        token.image = (user as any).image || null;
      }
      if (account?.provider === "google") {
        token.role = "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).image = token.image;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "opalstore-secret-key-change-in-production",
};
