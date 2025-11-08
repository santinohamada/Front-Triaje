export const config = {
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === "true",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
}
