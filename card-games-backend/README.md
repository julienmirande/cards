## Setting up this project

In order to run this project you must have `npm` and `node` installed (suggested version are `npm 6.9.0` and `node 10.16.3`). You can use [nvm](https://github.com/nvm-sh/nvm) to install these.

In the `card-games-backend` folder run the following commands
- run `npm install` to install all project dependencies

- run `npm i -g node-dev` to install hot-reload node version

## Running this project in development mode
- run `source connectionVariables.sh` this will set all environment variables to connect to the database
- `npm run dev` will start the service in development mode


## Running this project
- run `source connectionVariables.sh` this will set all environment variables to connect to the database
- `npm start` will start the service

## Running integration tests
_Attention: Application must be running on port 3000 for integration tests to run_
- run `npm test` in the `card-games-backend` folder to run all integration tests and linting