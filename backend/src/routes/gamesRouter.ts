import { Context } from "koa"
import Router from "koa-router"
import { handleWebsocket } from "../lib/websocket"
import * as Games from "../controllers/gamesController"

export const gamesRouter = new Router()

gamesRouter.get("/games", async (ctx: Context) => {
	ctx.body = await Games.findAll()
})

gamesRouter.get("/games/debug", async (ctx: Context) => {
	ctx.body = JSON.stringify(await Games.debugInfo(), undefined, 2)
})

gamesRouter.get("/games/:id", async (ctx: Context) => {
	const openWs = handleWebsocket(ctx)
	if (openWs) {
		return await Games.listen(ctx.params.id, openWs)
	}
	ctx.body = await Games.findGame(ctx.params.id)
})

gamesRouter.post("/games/:id/start", async (ctx: Context) => {
	ctx.body = await Games.start(ctx.params.id)
})

gamesRouter.post("/games/:id/stop", async (ctx: Context) => {
	ctx.body = await Games.stop(ctx.params.id)
})
