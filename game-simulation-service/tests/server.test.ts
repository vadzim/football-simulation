import net from "net"
import request from "supertest"
import { from, toArray } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import { server } from "../src/server"

const timeStampPrecision = 20 // ms

describe("net server", () => {
	it("starts simulation", async () => {
		const { port } = server.listen().address()

		const client = net.connect({ port, allowHalfOpen: true }, () => {
			client.write(JSON.stringify({ id: 42, team1: "rikki", team2: "tikki" }))
			client.end()
		})

		const onDataPromise = new Promise((resolve, reject) => {
			client.on("data", data => {
				resolve(JSON.parse(String(data).trim()))
				client.destroy()
				server.close()
			})
			setTimeout(() => {
				reject(new Error("timeout"))
				client.destroy()
				server.close()
			}, 1000)
		})

		const result = await onDataPromise

		expect(result).toEqual({
			id: 42,
			team1: "rikki",
			team2: "tikki",
			score1: 0,
			score2: 0,
			status: "started",
		})
	})
})
