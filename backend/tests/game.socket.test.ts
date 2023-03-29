import request from "supertest"
import WebSocket from "ws"
import { app } from "../src/server"

describe("ws://server/games/:id", () => {
	let server, ws, port
	beforeAll(() => {
		server = app.listen()
		;({ port } = server.address())
	})

	afterAll(() => {
		server.close()
	})

	beforeEach(done => {
		ws = new WebSocket(`ws://localhost:${port}/games/1`)
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
			const socketInput = new Promise((resolve, reject) =>
				ws.once("message", resolve).once("error", reject),
			)

			const res = await request(server).post("/games/1/start")
			expect(res.statusCode).toEqual(200)

			const json = JSON.parse(String(await socketInput))

			expect(json).toEqual({
				id: "1",
				team1: "Germany",
				team2: "Poland",
				score1: 0,
				score2: 0,
				started: true,
			})
		}

		{
			const socketInput = new Promise((resolve, reject) =>
				ws.once("message", resolve).once("error", reject),
			)

			const res = await request(server).post("/games/1/stop")
			expect(res.statusCode).toEqual(200)

			const json = JSON.parse(String(await socketInput))

			expect(json).toEqual({
				id: "1",
				team1: "Germany",
				team2: "Poland",
				score1: 0,
				score2: 0,
				started: false,
			})
		}

		if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		}
	})
})
