import request from "supertest"
import { app } from "../src/server"

describe("GET /games", () => {
	it("responds with a JSON array of games", async () => {
		const response = await request(app.callback()).get("/games")
		expect(response.status).toBe(200)
		expect(response.body).toEqual([
			{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
			{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
			{ id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
		])
	})
})

describe("start/stop", () => {
	it("starts non-started simulation and stops started simulation", async () => {
		{
			const response = await request(app.callback()).post("/games/stop")
			expect(response.status).toBe(409)
		}

		{
			const response = await request(app.callback()).post("/games/start")
			expect(response.status).toBe(200)
			expect(response.body).toEqual({
				started: true,
				games: [
					{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
					{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
					{ id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
				],
			})
		}

		{
			const response = await request(app.callback()).post("/games/start")
			expect(response.status).toBe(409)
		}

		{
			const response = await request(app.callback()).post("/games/stop")
			expect(response.status).toBe(200)
			expect(response.body).toEqual({
				started: false,
				games: [
					{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
					{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
					{ id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
				],
			})
		}

		{
			const response = await request(app.callback()).post("/games/stop")
			expect(response.status).toBe(409)
		}
	})
})
