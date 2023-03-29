import request from "supertest"
import { startSimulator } from "../src/game/game"

describe("game simulator", () => {
	it("simulates a game", async () => {
		for await (data of startSimulator({})) {}
	})
})
