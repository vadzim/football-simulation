export const config = {
	testEnvironment: process.env.NODE_ENV === "test",
	port: Number(process.env.PORT) || 3000,
	simulationServicePort: Number(process.env.SIMULATION_PORT) || 3030,
	simulationServiceHost: process.env.SIMULATION_HOST || "localhost",
}
