import { useEffect, useState } from "react"
import { Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import { config } from "./config"

export const Games = () => {
  const [games, setGames] = useState<{ id: string; team1: string; team2: string }[]>([])

  useEffect(() => {
    ;(async () => {
     const req = await fetch(`${config.api}/games`) 
     setGames(await req.json())
    })()
  }, [])

	const [scores, setScores] = useState<{
		[id: string]: { score1: number; score2: number; started: boolean }
	}>({})

	const start = () => {
		for (const { id } of games) {
			fetch(`${config.api}/games/${id}/start`, { method: "POST" })
		}
	}

	const stop = () => {
		for (const { id } of games) {
			fetch(`${config.api}/games/${id}/stop`, { method: "POST" })
		}
	}

	useEffect(() => {
		const sockets = games.map(({ id }) => {
			const ws = new WebSocket(`${config.api.replace(/^http/, "ws")}/games/${id}`)
			ws.onmessage = ({ data }) => {
				if (data) {
					const { score1, score2, started }: { score1: number; score2: number; started: boolean } =
						JSON.parse(data)
					setScores(s => ({ ...s, [id]: { score1, score2, started } }))
				}
			}
			return ws
		})
		return () => {
			for (const ws of sockets) ws.close()
		}
	}, [games])

	const totalGoals = Object.values(scores).reduce((sum, { score1, score2 }) => sum + score1 + score2, 0)
	const smthStarted = Object.values(scores).some(({ started }) => started)

	return (
		<Wrapper>
			<Box>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						if (smthStarted) {
							stop()
						} else {
							start()
						}
					}}
				>
					{smthStarted ? <>Finish</> : totalGoals === 0 ? <>Start</> : <>Restart</>}
				</Button>
				{games.map(({ id, team1, team2 }) => {
					const { score1, score2 } = scores[id] || { score1: 0, score2: 0 }
					return (
						<GameResultWrapper key={id}>
							<Typography variant="h6" style={{ flex: 1 }}>
								{team1} vs {team2}:
							</Typography>
							<Typography variant="h6">
								{score1} - {score2}
							</Typography>
						</GameResultWrapper>
					)
				})}
				<TotalGoalsWrapper>
					<Typography style={{ flex: 1 }}>Total Goals:</Typography>
					<Typography style={{ marginLeft: "0.5em" }}>{totalGoals}</Typography>
				</TotalGoalsWrapper>
			</Box>
		</Wrapper>
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
	align-self: flex-end;
	align-items: center;
	margin-top: 20px;
`

const GameResultWrapper = styled.div`
	display: flex;
	gap: 3em;
	align-self: stretch;
	align-items: center;
	justify-content: space-between;
	margin-top: 10px;
`
