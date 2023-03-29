import WebSocket from "ws"
import split2 from "split2"
import { connect, Socket } from "net"
import { once } from "events"
import { config } from "../config.ts"

type Game = {
	data: {
		id: string
		team1: string
		team2: string
		score1: number
		score2: number
	}
	clients: WebSocket[]
	server?: Socket
}

const games: Game[] = [
	{ data: { id: "1", team1: "Germany", team2: "Poland", score1: 0, score2: 0 }, clients: [] },
	{ data: { id: "2", team1: "Brazil", team2: "Mexico", score1: 0, score2: 0 }, clients: [] },
	{
		data: { id: "3", team1: "Argentina", team2: "Uruguay", score1: 0, score2: 0 },
		clients: [],
	},
]

//
//
export const debugInfo = async () => {
	return games.map(game => ({
		...game,
		server: Boolean(game.server),
		clients: game.clients.length,
	}))
}

//
//
export const findAll = async () => {
	return games.map(formatGame)
}

//
//
export const findGame = async (id: string) => {
	return formatGame(await getGame(id))
}

//
//
export const start = async (id: string) => {
	const game = await getGame(id)
	if (game.server) throw Object.assign(new Error(), { expose: true, status: 409 })

	game.data.score1 = 0
	game.data.score2 = 0

	const server = connect(
		{ port: config.simulationServicePort, host: config.simulationServiceHost, allowHalfOpen: true },
		() => {
			server
				.pipe(split2(JSON.parse))
				.on("data", (data: { score1: number; score2: number }) => {
					game.data.score1 = data.score1
					game.data.score2 = data.score2
					sendMessageToClients(game.clients, { ...game.data, started: true })
				})
				.on("end", () => {
					game.server = undefined
					sendMessageToClients(game.clients, { ...game.data, started: false })
				})

			server.write(JSON.stringify({ id, team1: game.data.team1, team2: game.data.team2 }))
			server.end()
		},
	)

	game.server = server

	return formatGame(game)
}

//
//
export const stop = async (id: string) => {
	const game = await getGame(id)
	if (!game.server) throw Object.assign(new Error(), { expose: true, status: 409 })

	game.server.destroy()
	game.server = undefined

	sendMessageToClients(game.clients, { ...game.data, started: false })

	return formatGame(game)
}

//
//
export const listen = async (id: string, openWs: () => Promise<WebSocket>) => {
	// check game existance before opening a websocket
	const game = await getGame(id)

	// we are good, opening the websocket
	const ws = await openWs()
	game.clients.push(ws)
	ws.send(JSON.stringify(formatGame(game)))
	await once(ws, "close")
	game.clients.splice(game.clients.indexOf(ws), 1)
}

//
//
const getGame = async (id: string) => {
	const game = games.find(g => g.data.id === id)
	if (!game) throw Object.assign(new Error(), { expose: true, status: 404 })
	return game
}

const sendMessageToClients = (clients: WebSocket[], json: unknown) => {
	const message = JSON.stringify(json)
	for (const client of clients) client.send(message)
}

const formatGame = (game: Game) => ({ ...game.data, started: Boolean(game.server) })
