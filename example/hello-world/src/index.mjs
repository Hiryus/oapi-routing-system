/*
 * This is the entry point for our server.
 * It creates an express server with oapir-outing-system and runs it forever.
 */

import express from 'express';
import swagger from 'swagger-ui-express';
import { OApiRoutingSystem } from 'oapi-routing-system';

const title = 'hello-world';
const description = 'This is a minimal example of how to use the oapi-routing-system.';
const version = '1.0.0';

async function main(port) {
    // Initialize a new router
    const crs = new OApiRoutingSystem();
    // Set the generic information about the API required by OpenAPI
    await crs.defineOpenApiInfo(title, description, version);
    // Load our only route from src/route/hellow-world.mjs
    await crs.loadFile('src/route/hellow-world.mjs');

    // Create an express server with JSON and urlencoded body parsers
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('json spaces', 2);

    // Get the final open-api description and serve it with you favourite UI (here, swagger-ui)
    const openapi = crs.getOpenApiAsJson();
    app.use('/swagger', swagger.serve);
    app.get('/swagger', swagger.setup(openapi));

    // Add our router to the express server
    app.use(crs.getRouter());

    // Finally, don't forget to actually start the server :)
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

main(1989).catch(console.error);
