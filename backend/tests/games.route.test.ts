import request from "supertest"
import { app } from "../src/server"

describe("GET /games", () => {
	it("responds with a JSON array of games", async () => {
		const response = await request(app.callback()).get("/games")
		expect(response.status).toBe(200)
		expect(response.body).toEqual([
			{ id: "1", team1: "Germany", team2: "Poland", started: false, score1: 0, score2: 0 },
			{ id: "2", team1: "Brazil", team2: "Mexico", started: false, score1: 0, score2: 0 },
			{ id: "3", team1: "Argentina", team2: "Uruguay", started: false, score1: 0, score2: 0 },
		])
	})
})

describe("POST /games/:id/start|stop", () => {
	it("starts not started game and stops started game", async () => {
		{
			const response = await request(app.callback()).post("/games/1/stop")
			expect(response.status).toBe(409)
		}

		{
			const response = await request(app.callback()).post("/games/1/start")
			expect(response.status).toBe(200)
			expect(response.body).toEqual({ id: "1", team1: "Germany", team2: "Poland", started: true })
		}

		{
			const response = await request(app.callback()).post("/games/1/start")
			expect(response.status).toBe(409)
		}

		{
			const response = await request(app.callback()).post("/games/1/stop")
			expect(response.status).toBe(200)
			expect(response.body).toEqual({ id: "1", team1: "Germany", team2: "Poland", started: false })
		}

		{
			const response = await request(app.callback()).post("/games/1/stop")
			expect(response.status).toBe(409)
		}
	})
})
