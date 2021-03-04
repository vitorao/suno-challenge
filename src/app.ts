import 'reflect-metadata';
import * as express from "express";
import * as bodyParser from 'body-parser';

import { Routes } from './routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

new Routes(app);

export = app;
