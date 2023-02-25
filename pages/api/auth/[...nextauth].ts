import NextAuth from "next-auth";
import BungieProvider from "next-auth/providers/bungie";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    BungieProvider({
      clientId: process.env.BUNGIE_APP_CLIENT_ID,
      clientSecret: process.env.BUNGIE_APP_CLIENT_SECRET,
      authorization: {
        url: "https://www.bungie.net/en/OAuth/Authorize?reauth=true",
        params: {
          scope: "",
        },
      },
      userinfo: {
        url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
      },
      httpOptions: {
        headers: {
          "X-API-Key": process.env.BUNGIE_API_KEY,
        },
      },
    }),
  ],
};
export default NextAuth(authOptions);
