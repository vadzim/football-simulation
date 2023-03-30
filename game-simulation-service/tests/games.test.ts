import { from, toArray } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import { startSimulator } from "../src/game/game"

const timeStampPrecision = 50 // ms

describe("game simulator", () => {
	it("simulates a game", async () => {
		const timeStart = Date.now()

		const game = startSimulator(
			[
				{ id: "42", team1: "rikki", team2: "tikki" },
				{ id: "44", team1: "simon", team2: "pumba" },
			],
			{ scoreDelay: 100 },
		)

		const scores = from(game).pipe(
			map(data => ({
				data,
				timestamp: Math.round((Date.now() - timeStart) / timeStampPrecision) * timeStampPrecision,
			})),
		)
		const result = await toArray(scores)

		const dataTemplate = { id: expect.any(String), scoredTeam: expect.any(String) }

		// TODO: test that id is one of sent ids and scoredTeam is one of playing in that game
		expect(result).toEqual([
			{
				timestamp: 100,
				data: dataTemplate,
			},
			{
				timestamp: 200,
				data: dataTemplate,
			},
			{
				timestamp: 300,
				data: dataTemplate,
			},
			{
				timestamp: 400,
				data: dataTemplate,
			},
			{
				timestamp: 500,
				data: dataTemplate,
			},
			{
				timestamp: 600,
				data: dataTemplate,
			},
			{
				timestamp: 700,
				data: dataTemplate,
			},
			{
				timestamp: 800,
				data: dataTemplate,
			},
			{
				timestamp: 900,
				data: dataTemplate,
			},
		])
	})
})
