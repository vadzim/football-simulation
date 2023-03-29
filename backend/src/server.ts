import Koa from "koa"
import { gamesRouter } from "./routes/gamesRouter"
import { config } from "./config.ts"

export const app = new Koa()

app.use(async (ctx, next) => {
	ctx.set("Access-Control-Allow-Origin", "*")
	ctx.set("Access-Control-Allow-Headers", "*")
	ctx.set("Access-Control-Allow-Methods", "*")
	await next()
})

app.use(gamesRouter.routes())
app.use(gamesRouter.allowedMethods())

if (!config.testEnvironment) {
	app.listen(config.port, () => {
		console.log(`Server listening on port ${config.port}`)
	})
}
