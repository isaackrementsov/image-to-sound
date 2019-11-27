// Routes URL requests to corresponding controller methods

import IndexController from '../controllers/IndexController';
import AudioController from '../controllers/AudioController';

let routes = app => {
    let indexController : IndexController = new IndexController();
    let audioController : AudioController = new AudioController();

    app.get('/', indexController.get);
    app.get('/audio', audioController.get);

    app.post('/', indexController.post);
}

export default routes;
