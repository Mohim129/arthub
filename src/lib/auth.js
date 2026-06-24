import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getOAuthState } from "better-auth/api";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const oAuthState = await getOAuthState();
          const role = oAuthState?.role || "user";
          return {
            data: {
              ...user,
              role,
              bio: oAuthState?.bio || "",
              image: oAuthState?.image || "",
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        default: "user",
      },
      bio: {
        default: "",
      },
      image: {
        default: "",
      },
    },
  },
});
