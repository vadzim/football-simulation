import WebSocket from "ws"
import split2 from "split2"
import { connect, Socket } from "net"
import { once } from "events"
import { config } from "../config.ts"

type Game = {
	id: string
	team1: string
	team2: string
	score1: number
	score2: number
}

type State = {
	simulation: Socket | undefined
	clients: Set<WebSocket>
	games: Game[]
}

const state: State = {
	simulation: undefined,
	clients: new Set(),
	games: [
		{ id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 },
		{ id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 },
		{
			id: "3",
			team1: "Argentina",
			team2: "Uruguay",
			score1: 0,
			score2: 0,
		},
	],
}

//
//
export const debugInfo = async () => {
	return {
		started: Boolean(state.simulation),
		clients: state.clients.size,
	}
}

//
//
export const findAll = async () => {
	return state.games
}

//
//
export const start = async () => {
	if (state.simulation) throw Object.assign(new Error(), { expose: true, status: 409 })

	state.games = state.games.map(game => ({ ...game, score1: 0, score2: 0 }))

	const server = connect(
		{ port: config.simulationServicePort, host: config.simulationServiceHost, allowHalfOpen: true },
		() => {
			server
				.pipe(split2(JSON.parse))
				.on("data", ({ id, scoredTeam }: { id: string; scoredTeam: string }) => {
					scoreGoal(id, scoredTeam)
					updateClients()
				})
				.on("end", () => {
					state.simulation = undefined
					updateClients()
				})

			server.write(
				JSON.stringify({ games: state.games.map(({ id, team1, team2 }) => ({ id, team1, team2 })) }),
			)
			server.end()
		},
	)
	state.simulation = server

	updateClients()

	return formatState(state)
}

//
//
export const stop = async () => {
	if (!state.simulation) throw Object.assign(new Error(), { expose: true, status: 409 })

	state.simulation.destroy()
	state.simulation = undefined

	updateClients()

	return formatState(state)
}

//
//
export const listen = async (openWs: () => Promise<WebSocket>) => {
	const ws = await openWs()
	state.clients.add(ws)
	ws.send(JSON.stringify(formatState(state)))
	await once(ws, "close")
	state.clients.delete(ws)
}

//
//

const scoreGoal = (id: string, scoredTeam: string) => {
	const newGames = [...state.games]
	const gameIndex = newGames.findIndex(game => game.id === id)
	const game = newGames[gameIndex]
	newGames.splice(gameIndex, 1, {
		...game,
		...(game.team1 === scoredTeam ? { score1: game.score1 + 1 } : { score2: game.score2 + 1 }),
	})
	state.games = newGames
}

const updateClients = () => sendMessageToClients(state.clients, formatState(state))

const sendMessageToClients = (clients: Iterable<WebSocket>, json: unknown) => {
	const message = JSON.stringify(json)
	for (const client of clients) client.send(message)
}

const formatState = (s: State) => ({
	started: Boolean(s.simulation),
	games: s.games,
})
