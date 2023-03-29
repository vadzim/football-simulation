import Koa, { Context } from "koa"
import Router from "koa-router"

const games = [
	{ id: "1", name: "Game 1" },
	{ id: "2", name: "Game 2" },
	{ id: "3", name: "Game 3" },
]

export const gamesRouter = new Router()

gamesRouter.get("/games", (ctx: Context) => {
	ctx.body = games
})
