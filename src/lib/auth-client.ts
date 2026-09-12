import { createAuthClient } from "better-auth/react";

// Create an auth client instance to be used in the Frontend
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
})