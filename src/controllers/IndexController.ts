// Handles requests to the '/' url, core of the app

import {Request, Response} from 'express';

export default class IndexController {
    // Render the basic index page
    get = (req: Request, res: Response) => {
        res.render('index');
    }

    // Handle the image sent and return an audio file
    post = (req: Request, res: Response) => {

    }
}
