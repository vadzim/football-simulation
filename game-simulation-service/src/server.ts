import net from "net"
import { Readable } from "stream"
import { from } from "ix/asynciterable"
import { map } from "ix/asynciterable/operators"
import getStream from "get-stream"
import { config } from "./config"
import { startSimulator } from "./game/game"

export const server = net.createServer({ allowHalfOpen: true }, async socket => {
	console.log("Client connected:", socket.remoteAddress, socket.remotePort)

	const game = JSON.parse(String(await getStream.buffer(socket)).trim())
	console.log("Starting a game:", game)

	Readable.from(stringifyAsyncIterable(startSimulator(game)))
		.pipe(socket)
		.on("finish", () => console.log("Game finished:", game))
})

const stringifyAsyncIterable = (iterable: AsyncIterable<unknown>) =>
	from(iterable).pipe(map(data => JSON.stringify(data) + "\n"))

if (!config.testEnvironment) {
	server.listen(config.port, () => {
		console.log(`Server listening on port ${config.port}`)
	})
}
