// Set the express app's properties: port, view directory, form parsing, error flashing

import * as reflect from 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as flash from 'connect-flash-plus';

import ejs from 'ejs';

const app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

export default app;