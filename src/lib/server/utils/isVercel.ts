export function isVercel() {
    return process.env.VERCEL !== undefined || process.env.VERCEL_ENV !== undefined;
}