import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/db/connectDB";
import User from "@/model/user";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false; // Ensure email exists

      if (account.provider === "github" || account.provider === "google") {
        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
          { email: user.email },
          { email: user.email, name: user.name},
          { upsert: true, new: true } // Create if not found, return new doc
        );

        user.name = updatedUser.name;
        return true;
      }

      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };