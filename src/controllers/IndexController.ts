// Handles requests to the '/' url, core of the app

import {Request, Response} from 'express';
import * as Busboy from 'busboy';
import * as shortId from 'shortid';
import * as fs from 'fs';
import * as path from 'path';
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
            let converter;

            req.pipe(busboy);

            busboy.on('field', (key, val) => req.body[key] = val);

            busboy.on('file', async (_fieldname, file, filename, _encoding, mimetype) => {
                if(mimetype.indexOf('image/') == -1){
                    req.flash('error', 'Invalid file type');
                }else{
                    let errored = false;
                    let saveTo = path.join(__dirname, '/../../public/img/uploads/' + shortId.generate() + filename);
                    converter = new ConversionManager(saveTo);

                    file.on('limit', () => {
                        errored = true;
                    });

                    file.pipe(fs.createWriteStream(saveTo));
                }
            });

            busboy.on('finish', () => {
                converter.convert(
                    parseInt(req.body.height),
                    parseInt(req.body.width),
                    parseInt(req.body.numberChunksX),
                    parseInt(req.body.numberChunksY),
                    parseFloat(req.body.blockDuration),
                    req.body.mappingFunction,
                    (audioPath, duration) => {
                        res.redirect(`/audio?p=${audioPath}&d=${duration}`);
                    }
                );
            });
        }catch(e){
            if(!res.headersSent){
                req.flash('error', 'There was an error processing the file');
                res.redirect('/');
            }
        }
    }
}
