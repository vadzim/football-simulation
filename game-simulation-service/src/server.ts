import net from "net"
import { Readable } from "stream"
import { startSimulator } from "./game/game"
import getStream from "get-stream"

const server = net.createServer({ allowHalfOpen: true }, async socket => {
	console.log("Client connected:", socket.remoteAddress, socket.remotePort)

	const game = JSON.parse(String(await getStream.buffer(socket)))
	console.log("Starting a game:", game)

	Readable.from(startSimulator(game)).pipe(socket)
	console.log("Game finished:", game)
})

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== "test") {
	server.listen(port, () => {
		console.log(`Server listening on port ${port}`)
	})
}
