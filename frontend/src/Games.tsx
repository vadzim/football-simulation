import { useEffect, useState } from "react"
import { Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import { config } from "./config"

export const Games = () => {
	const [state, setState] = useState<{
		started: boolean
		games: { id: string; team1: string; team2: string; score1: number; score2: number }[]
	}>({ started: false, games: [] })

	const start = () => {
		fetch(`${config.api}/games/start`, { method: "POST" })
	}

	const stop = () => {
		fetch(`${config.api}/games/stop`, { method: "POST" })
	}

	useEffect(() => {
		const ws = new WebSocket(`${config.api.replace(/^http/, "ws")}/games/listen`)
		ws.onmessage = ({ data }) => {
			if (data) {
				const newState = JSON.parse(data)
				setState(newState)
			}
		}
		return () => {
			ws.close()
		}
	}, [])

	const totalGoals = state.games.reduce((sum, { score1, score2 }) => sum + score1 + score2, 0)

	return (
		<Wrapper>
			<Box>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						if (state.started) {
							stop()
						} else {
							start()
						}
					}}
				>
					{state.started ? <>Finish</> : totalGoals === 0 ? <>Start</> : <>Restart</>}
				</Button>
				{state.games.map(({ id, team1, team2, score1, score2 }) => (
					<ResultWrapper key={id}>
						<Typography variant="h6">
							{team1} vs {team2}:
						</Typography>
						<Typography variant="h6">
							{score1} - {score2}
						</Typography>
					</ResultWrapper>
				))}
				<ResultWrapper>
					<TotalGoalsWrapper>{state.started && <TimerForDebugPurpose />}</TotalGoalsWrapper>
					<TotalGoalsWrapper>
						<Typography>Total Goals:</Typography>
						<Typography>{totalGoals}</Typography>
					</TotalGoalsWrapper>
				</ResultWrapper>
			</Box>
		</Wrapper>
	)
}

const TimerForDebugPurpose = () => {
	const [currentTime, setCurrentTime] = useState(0)
	useEffect(() => {
		const startTime = Date.now()
		const h = setInterval(() => setCurrentTime(Math.round((Date.now() - startTime) / 1000)), 1000)
		return () => clearInterval(h)
	}, [])
	return (
		<span style={{ color: "#bbb" }}>{`${Math.floor(currentTime / 60)}:${String(currentTime % 60).padStart(
			2,
			"0",
		)}`}</span>
	)
}

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
`

const Box = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 10px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	padding: 16px;
	margin-top: 4em;
`

const TotalGoalsWrapper = styled.div`
	display: flex;
	align-items: center;
	margin-top: 20px;
	gap: 0.3em;
`

const ResultWrapper = styled.div`
	display: flex;
	gap: 3em;
	align-self: stretch;
	align-items: center;
	justify-content: space-between;
	margin-top: 10px;
`
