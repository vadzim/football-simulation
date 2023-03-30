import request from "supertest"
import WebSocket from "ws"
import { app } from "../src/server"
import { type Server } from "http"

describe("ws://server/games/listen", () => {
	let server: Server
	let ws: WebSocket
	let port: number

	beforeAll(() => {
		server = app.listen()
		;({ port } = server.address() as { port: number })
	})

	afterAll(() => {
		server.close()
	})

	beforeEach(done => {
		ws = new WebSocket(`ws://localhost:${port}/games/listen`)
		ws.on("open", () => {
			done()
		})
	})

	afterEach(done => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		}
		done()
	})

	it("should send a start/stop message after starting/stopping a game", async () => {
		{
			const socketInput = new Promise((resolve, reject) => ws.once("message", resolve).once("error", reject))

			const res = await request(server).post("/games/start")
			expect(res.statusCode).toEqual(200)

			const json = JSON.parse(String(await socketInput))

			expect(json).toEqual({
				started: true,
				games: [
					{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
					{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
					{ id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
				],
			})
		}

		{
			const socketInput = new Promise((resolve, reject) => ws.once("message", resolve).once("error", reject))

			const res = await request(server).post("/games/stop")
			expect(res.statusCode).toEqual(200)

			const json = JSON.parse(String(await socketInput))

			expect(json).toEqual({
				started: false,
				games: [
					{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
					{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
					{ id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
				],
			})
		}

		if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		}
	})
})
