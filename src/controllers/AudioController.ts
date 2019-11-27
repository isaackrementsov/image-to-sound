import { Request, Response } from 'express';

export default class AudioController {
    get = (req: Request, res: Response) => {
        res.render('audio', {session: req.session, error: req.flash('error'), path: req.query.p, duration: parseInt(req.query.d)});
    }
}
