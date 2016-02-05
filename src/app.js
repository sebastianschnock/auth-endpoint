import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import routeAuthenticate from './routes/authenticate';
import routeUsers from './routes/users';
import { handleError } from './helpers/error-handler';

// configure server

var app = express();
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json({ type: 'application/vnd.api+json' }));
app.use(bodyparser.json({ type: 'application/json' }));
app.use(cors());
app.use(morgan('combined'));

// set up routes

app.use(routeAuthenticate);
app.use(routeUsers);
app.use(handleError);

export default app;
