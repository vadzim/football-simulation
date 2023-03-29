export const config = {
	testEnvironment: process.env.NODE_ENV === "test",
	port: Number(process.env.PORT) || 3000,
}
