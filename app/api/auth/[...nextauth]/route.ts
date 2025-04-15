import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export { auth as middleware } from "@/auth";
export const { GET, POST } = handlers;
