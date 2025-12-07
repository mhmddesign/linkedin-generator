import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

const handler = NextAuth({
    providers: [
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            issuer: "https://www.linkedin.com/oauth",
            authorization: {
        params: { scope: "openid profile email" },
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
            authorization: {
                params: {
                    scope: "openid profile email w_member_social",
                },
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
            // Send the accessToken to the client
            session.accessToken = token.accessToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
