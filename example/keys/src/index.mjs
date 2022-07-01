/*
 * This is the entry point for our server.
 * It creates an express server with oapir-outing-system and runs it forever.
 */

import express from 'express';
import swagger from 'swagger-ui-express';
import { OApiRoutingSystem, ValidationError } from 'oapi-routing-system';

const title = 'key-service';
const description = 'This service creates unmodifiable keys with an owner and a recipient. Once created each key can be retreived but never modified.';
const version = '1.0.0';

async function main(port) {
    // This is a dummy configuration for our routes
    // It can be anything and will be passed to each route handler untouched
    const configuration = {};

    // Initialize a new router
    const crs = new OApiRoutingSystem(configuration);
    // Set the generic information about the API required by OpenAPI
    await crs.defineOpenApiInfo(title, description, version);
    // Load all routes from src/route (relative to application working directory)
    await crs.loadFolder('src/route');

    // Create an express server with JSON and urlencoded body parsers
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('json spaces', 2);

    // Get the final open-api description and serve it with you favourite UI (here, we use swagger-ui)
    const openapi = crs.getOpenApiAsJson();
    app.use('/swagger', swagger.serve);
    app.get('/swagger', swagger.setup(openapi));

    // Add our router to the express server
    app.use(crs.getRouter());

    // Add error management: OApiRoutingSystem will forward a ValidationError if a request is invalid
    // Here, we return an HTTP 400 error in this case, with the descriptive message contained in the error
    app.use((err, req, res, next) => {
        if (err instanceof ValidationError) {
            // Note that the response corresponds to the format defined in `schema/error` which
            // is used in the responses definition of all our endpoints
            res.status(400).json({
                code: 'INPUT_VALIDATION_ERROR',
                message: err.message,
                trackingId: 'b21bca30-9554-4d3e-a912-38e4db188b86',
            });
        } else {
            // In a real production code base, we should handle other errors here, but since
            //  this is just demonstration code, we just let express handle other errors here
            next(err);
        }
    });

    // Finally, don't forget to actually start the server :)
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

main(1989).catch(console.error);
