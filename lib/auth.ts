import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.DB_URI as string)
const db = client.db("SalonBook")

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000"

const trustedOrigins = [
  appUrl,
  ...(process.env.TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
]

export const auth = betterAuth({
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Role and blocked status can never be chosen by a public sign-up.
        before: async (user) => ({
          data: {
            ...user,
            role: "customer",
            isBlocked: false,
          },
        }),
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: appUrl,
        audience: appUrl,
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
})
