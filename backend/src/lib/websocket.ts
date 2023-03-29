import { Context } from "koa"
import WebSocket from "ws"

const wss = new WebSocket.Server({ noServer: true })

export const handleWebsocket = (ctx: Context): (() => Promise<WebSocket>) | undefined => {
	if (ctx.request.headers.upgrade === "websocket") {
		return () =>
			new Promise(resolve => wss.handleUpgrade(ctx.req, ctx.socket, Buffer.alloc(0), ws => resolve(ws)))
	}
	return undefined
}
