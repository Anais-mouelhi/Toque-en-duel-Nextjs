import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
          // Return null if user not found or password is incorrect
          return null;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    // You can add more providers here if needed
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      // Since you're not using GitHub, you can simplify this callback
      if (account?.provider === "credentials") {
        return true;
      }
      // Add any additional logic for other providers if you add them later
      return false;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };