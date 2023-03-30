import sleep from "sleep-promise"

export async function* startSimulator(
	games: { id: string; team1: string; team2: string }[],
	options: { scoreDelay: number } = { scoreDelay: 10_000 },
) {
	const start = Date.now()

	for (let i = 0; i < 9; i++) {
		await sleep(start + options.scoreDelay * (i + 1) - Date.now())
		const random = Math.random() * games.length
		const gameIndex = Math.floor(random)
		const game = games[gameIndex]
		const scoredTeam = random - gameIndex < 0.5 ? game.team1 : game.team2
		yield { id: game.id, scoredTeam }
	}
}
