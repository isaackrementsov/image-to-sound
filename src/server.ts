/*

Image to Sound
Created by Isaac Krementsov, 11/17/2019

Web app that separates an image into its pixels, reads the color frequencies,
and uses them to generate an audio file

*/

// Runs the app defined in app.ts on the specified port, applies routes

import app from './app';
import routes from './server/routes';

app.listen(app.get('port'), () => {
    console.log('App is running on localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('Press CTRL + C to stop');
});

routes(app);
