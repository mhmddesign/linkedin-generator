import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions = {
providers: [
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    issuer: "https://www.linkedin.com/oauth",
    authorization: {
      // ⚠️ CRITICAL: Added 'w_member_social' so we can POST, not just login.
      params: { scope: "openid profile email w_member_social" },
    },
    jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  }),
],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after sign in
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
