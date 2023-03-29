import Koa from "koa"
import { gamesRouter } from "./routes/gamesRouter"

export const app = new Koa()

app.use(gamesRouter.routes())
app.use(gamesRouter.allowedMethods())

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== "test") {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`)
	})
}
