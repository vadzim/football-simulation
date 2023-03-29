import request from "supertest"
import WebSocket from "ws"
import { once } from "events"
import { app } from "../src/server"

describe("WebSocket server", () => {
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

	it("should return a message after starting a game", async () => {
		const res = await request(app).post("/games/1/start")
		expect(res.statusCode).toEqual(200)

		const receivedMessage = once(ws, "message")

		expect(receivedMessage).toEqual({
			id: "1",
			team1: "Germany",
			team2: "Poland",
			score1: 0,
			score2: 0,
			started: true,
		})

		if (ws.readyState === WebSocket.OPEN) {
			ws.close()
		}
	})
})
