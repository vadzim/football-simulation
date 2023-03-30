import net from "net"
import { Readable } from "stream"
import { from } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import getStream from "get-stream"
import { config } from "./config"
import { startSimulator } from "./game/game"

export const server = net.createServer({ allowHalfOpen: true }, async socket => {
	console.log("Client connected:", socket.remoteAddress, socket.remotePort)

	const { games, options } = JSON.parse(String(await getStream.buffer(socket)).trim())
	console.log("Starting simulation of games:", games)

	Readable.from(stringifyAsyncIterable(startSimulator(games, options)))
		.pipe(socket)
		.on("finish", () => console.log("Game finished:", games))
})

const stringifyAsyncIterable = (iterable: AsyncIterable<unknown>) =>
	from(iterable).pipe(map(data => JSON.stringify(data) + "\n"))

if (!config.testEnvironment) {
	server.listen(config.port, () => {
		console.log(`Server listening on port ${config.port}`)
	})
}
