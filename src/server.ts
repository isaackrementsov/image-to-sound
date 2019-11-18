/*

Image to Sound
Created by Isaac Krementsov, 11/17/2019

Web app that separates an image into its pixels, reads the color frequencies, and uses them to generate an audio file

Deployment notes:

At the moment, the app does not use any databases, so it is fairly self-contained.

However, you will need to make sure you have
    * NodeJS (Tested on v8.11.4)
    * Typescript (npm i -g typescript)
    * All included modules in working directory (npm i)
    * A server with a maximum file upload size set above 5M

For production, I recommend
    * Some form of Linux. This app was built on Windows, but Linux is much better for a server configuration
    * PM2 for running the app as a service in the background
    * NGINX as a reverse proxy
    * An SSL Certificate (sudo certbot --nginx)

*/

// Runs the app defined in app.ts on the specified port, applies routes

import app from './app';
import routes from './server/routes';

app.listen(app.get('port'), () => {
    console.log('App is running on localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('Press CTRL + C to stop');
});

routes(app);
