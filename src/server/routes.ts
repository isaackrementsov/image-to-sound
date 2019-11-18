// Routes URL requests to corresponding controller methods

import IndexController from '../controllers/IndexController';

let routes = app => {
    let indexController : IndexController = new IndexController();

    app.get('/', indexController.get);

    app.post('/', indexController.post);
}

export default routes;
