import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// You can also add Google, GitHub, etc. providers

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🔑 Replace this with your own user lookup (e.g., from DB)
        if (
          credentials?.username === "admin" &&
          credentials?.password === "1234"
        ) {
          return { id: "1", name: "Admin User" };
        }
        return null; // ❌ login failed
      },
    }),
  ],
  session: {
    strategy: "jwt", // or "database" if using DB sessions
  },
  secret: process.env.NEXTAUTH_SECRET, // make sure you set this in .env
  pages: {
    signIn: "/auth/signin", // optional custom login page
  },
};
