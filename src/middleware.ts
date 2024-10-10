export { default } from "next-auth/middleware";

// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/shopping", "/coocking"] };
