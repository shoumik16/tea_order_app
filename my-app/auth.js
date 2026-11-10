import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import User from "./models/User";
import connectDB from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          if (!user.email) {
            return false;
          }

          const existingUser = await User.findOne({
            email: user.email,
          });

          if (existingUser) {
            // Update profile information without changing username
            await User.findOneAndUpdate(
              { email: user.email },
              {
                $set: {
                  name: user.name,
                  email: user.email,
                  image: user.image,
                },
              },
              {
                new: true,
                runValidators: true,
              }
            );
          } else {
            // Generate username for a new user
            const baseUsername = (user.name || "user")
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || "user";

            let username = baseUsername;
            let count = 1;

            // Ensure username is unique
            while (await User.findOne({ username })) {
              username = `${baseUsername}-${count}`;
              count++;
            }

            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              username,
            });
          }

          return true;
        } catch (error) {
          console.error("MongoDB user save error:", error);
          return false;
        }
      }

      return true;
    },
  },
});