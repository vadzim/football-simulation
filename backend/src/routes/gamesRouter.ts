import { Context } from "koa"
import Router from "koa-router"
import { handleWebsocket } from "../lib/websocket"
import * as Games from "../controllers/gamesController"

export const gamesRouter = new Router()

gamesRouter.get("/games", async (ctx: Context) => {
	ctx.body = await Games.findAll()
})

gamesRouter.get("/games/listen", async (ctx: Context) => {
	const openWs = handleWebsocket(ctx)
	if (!openWs) ctx.throw(404)
	await Games.listen(openWs)
})

gamesRouter.post("/games/start", async (ctx: Context) => {
	ctx.body = await Games.start()
})

gamesRouter.post("/games/stop", async (ctx: Context) => {
	ctx.body = await Games.stop()
})
