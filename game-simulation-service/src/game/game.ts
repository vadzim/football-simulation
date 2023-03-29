import sleep from "sleep-promise"

export async function* startSimulator(
	data: { id: unknown; team1: string; team2: string },
	options: { scoreDelay: number } = { scoreDelay: 10_000 },
) {
	let score1 = 0
	let score2 = 0

	const start = Date.now()

	yield { ...data, score1, score2, status: "started" }

	const probability = Math.random()

	for (let i = 0; i < 9; i++) {
		await sleep(start + options.scoreDelay * (i + 1) - Date.now())
		if (Math.random() < probability) {
			score1++
		} else {
			score2++
		}
		yield { ...data, score1, score2, status: "pending" }
	}
	yield { ...data, score1, score2, status: "finished" }
}
