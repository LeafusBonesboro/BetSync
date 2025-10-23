export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_ENV === 'production'
    ? 'https://bet-sync-vuzf.vercel.app'
    : process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');
