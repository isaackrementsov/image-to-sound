// Handles requests to the '/' url, core of the app

import {Request, Response} from 'express';
import * as Busboy from 'busboy';
import ConversionManager from '../managers/ConversionManager';

export default class IndexController {

    // Render the basic index page
    get = (req: Request, res: Response) => {
        res.render('index', {session: req.session, error: req.flash('error')});
    }

    // Handle the image sent and return an audio file
    post = (req: Request, res: Response) => {
        try {
            // Busboy is used so that the file can be streamed directly, instead of being saved and processed
            // This is better performance-wise, but it might be a good idea to change this for the sake of stability
            let busboy = new Busboy({headers: req.headers, limits: {fileSize: 5000000}});

            req.pipe(busboy);

            busboy.on('file', async (_fieldname, file, filename, _encoding, mimetype) => {
                if(mimetype.indexOf('image/') == -1){
                    req.flash('error', 'Invalid file type');
                }else{
                    let converter = new ConversionManager(file, filename);
                    let audio = await converter.convert();
                }
            });

            res.redirect('/');
        }catch(e){
            if(!res.headersSent){
                req.flash('error', 'There was an error processing the file');
                res.redirect('/');
            }
        }
    }
}
