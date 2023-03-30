import { connect } from "net"
import request from "supertest"
import { from, toArray } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import { server } from "../src/server"

const timeStampPrecision = 20 // ms

describe("net server", () => {
	it("starts simulation", async () => {
		const { port } = server.listen().address() as { port: number }

		const client = connect({ port, allowHalfOpen: true }, () => {
			client.write(
				JSON.stringify({
					options: { scoreDelay: 100 },
					games: [
						{ id: "42", team1: "rikki", team2: "tikki" },
						{ id: "44", team1: "simon", team2: "pumba" },
					],
				}),
			)
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

		// TODO: test that id is one of sent ids and scoredTeam is one of playing in that game
		expect(result).toEqual({ id: expect.any(String), scoredTeam: expect.any(String) })
	})
})
