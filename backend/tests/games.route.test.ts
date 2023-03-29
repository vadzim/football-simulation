import request from "supertest"
import { app } from "../src/server"

describe("GET /games", () => {
	it("responds with a JSON array of games", async () => {
		const response = await request(app.callback()).get("/games")
		expect(response.status).toBe(200)
		expect(response.body).toEqual([
			{ id: "1", name: "Game 1" },
			{ id: "2", name: "Game 2" },
			{ id: "3", name: "Game 3" },
		])
	})
})
