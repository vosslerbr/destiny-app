import NextAuth from "next-auth";
import BungieProvider from "next-auth/providers/bungie";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    BungieProvider({
      clientId: process.env.BUNGIE_APP_CLIENT_ID,
      clientSecret: process.env.BUNGIE_APP_CLIENT_SECRET,
    }),
  ],
};
export default NextAuth(authOptions);
