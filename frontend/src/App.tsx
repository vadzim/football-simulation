import { Suspense } from "react"
import { Games } from "./Games"

export const App = () => (
	<Suspense fallback="Loading...">
		<Games />
	</Suspense>
)
