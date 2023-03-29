import { from, toArray } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import { startSimulator } from "../src/game/game"

const timeStampPrecision = 50 // ms

describe("game simulator", () => {
	it("simulates a game", async () => {
		const timeStart = Date.now()

		const game = startSimulator({ id: 42, team1: "rikki", team2: "tikki" }, { scoreDelay: 100 })

		const scores = from(game).pipe(
			map(data => ({
				data,
				timestamp: Math.round((Date.now() - timeStart) / timeStampPrecision) * timeStampPrecision,
				totalScore: data.score1 + data.score2,
			})),
		)
		const result = await toArray(scores)

		expect(result).toEqual([
			{
				timestamp: 0,
				totalScore: 0,
				data: { id: 42, team1: "rikki", team2: "tikki", score1: 0, score2: 0, status: "started" },
			},
			{
				timestamp: 100,
				totalScore: 1,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 200,
				totalScore: 2,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 300,
				totalScore: 3,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 400,
				totalScore: 4,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 500,
				totalScore: 5,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 600,
				totalScore: 6,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 700,
				totalScore: 7,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 800,
				totalScore: 8,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 900,
				totalScore: 9,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "pending",
				},
			},
			{
				timestamp: 900,
				totalScore: 9,
				data: {
					id: 42,
					team1: "rikki",
					team2: "tikki",
					score1: expect.any(Number),
					score2: expect.any(Number),
					status: "finished",
				},
			},
		])
	})
})
