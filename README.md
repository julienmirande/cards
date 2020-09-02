## Running this project

In order to run this project you must have `npm` and `node` installed (suggested version are `npm 6.9.0` and `node 10.16.3`). You can use [nvm](https://github.com/nvm-sh/nvm) to install these.

This project is composed of two separated applications. The first one is the application backend (in the `card-games-backend` folder) and the other one is the application frontend (in the `card-games-frontend` folder) in order to start the application your local ports `3000` and `8080` must be free. You can use two terminals, one for each application. To run the backend application follow: 

In the `card-games-backend` folder run the following commands

- run `npm install` to install all project dependencies
- run `source connectionVariables.sh` this will set all environment variables to connect to the database

- _(Optional): You can replace the variables in the `connectionVariables.sh` to connect to any postgres instance you want_

- `npm start` will start the backend service on port `3000`

To run the frontend application follow:
In the `card-games-frontend` folder run the following commands

- run `npm install` to install all project dependencies
- run `npm run serve` to start the frontend service on port `8080`

After this, you should be able to see the application on [http://localhost:8080](http://localhost:8080).
