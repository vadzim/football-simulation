## Project Structure

There are three projects in this repository:

- Backend: Provides a REST API and accumulates results of a simulation.
- Simulation Service: Simulates games and emits goal events.
- Frontend: The user interface that interacts with the backend.

## Getting Started

### Docker Demo

To start the docker demo, run the following command in the root directory:

```
yarn demo
```

Then navigate to http://localhost:3000.

### Running Tests

To run docker tests for the backend and simulation service, run:

```
yarn test
```


### Local Setup

To start the demo locally without Docker:

1. Install packages for all three projects `yarn setup`

2. Start the projects `yarn dev`

3. Navigate to http://localhost:3000.

## Notes

At first, I misunderstood the task and implemented simulating games independently. I guessed that real simulations can be heavy processes and that all three simulations can be run on different machines. When writing this readme I realized the mistake and fixed the behavior to emit one goal per 10 seconds for all three games but lost possible parallelism.
