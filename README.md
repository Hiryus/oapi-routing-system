# OAPI Routing System

OAPI Routing System library is a middleware for express.js web servers aiming to simplify, secure and document APIs.

The goal is to define once and for all the API contract inside the code base, in a **simple** and **reusable** way.
Then, use this definition to generate **OpenAPI documentation** and **validate parameters** automatically.


## Example

Assuming your create the following route (`route/hello-world.js`):
```javascript
export const endpoint = '/';
export const method = 'get';
export const summary = 'Salute the visitor by his / her name.';

export const query = {
    name: {
        $type: 'string',
        $description: 'The visitor\'s name',
        $example: 'Bob',
    },
};

export const responses = [{
    $code: 200,
    $contentType: 'text/plain',
    $description: 'A salutation message.',
    $example: 'Hello Bob!',
    $schema: 'string',
}];

export async function handler(req, res, cfg) {
    res.send(`Hellow ${req.query.name}!`);
}
```

The library will automatically generate the following OpenAPI documentation:
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "hello-world",
    "description": "This is a minimal example of how to use the oapi-routing-system.",
    "version": "1.0.0"
  },
  "paths": {
    "/": {
      "get": {
        "summary": "Salute the visitor by his / her name.",
        "responses": {
          "200": {
            "description": "A salutation message.",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string",
                  "example": "Hello Bob!"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "name",
            "description": "The visitor's name",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "example": "Bob"
            }
          }
        ]
      }
    }
  }
}
```

If a visitor doesn't send a name as query parameter, the server will return an error.
Same if the parameter is not a string (although, this seems quite impossible since a query parameter is necessarily a string - but you get the idea).

You can check the complete code with comments in example/hellow-world.


## Usage

1. Create your routes, one per file, exporting the following parameters:
   - `endpoint` (string) - _REQUIRED_ - the endpoint where to mount the route (example: `/hellow-world`).
   - `method` (string) - _OPTIONAL_ - the HTTP method accepted by the endpoint (defaults to `get`).
   - `summary` (string) - _OPTIONAL_ - a short summary of the route, try to limit yourself to one line (default to none).
   - `description` (string) - _OPTIONAL_ - a longer explanation of the route, no length restriction (default to none).
   - `parameters` (object) - _OPTIONAL_ - if you have path parameters (ex: `/user/:id`) the specification for these (see below how to structure it).
   - `query` (object) - _OPTIONAL_ - specification if the query parameters accepted by the route (see examples on how to structure it).
   - `body` (object) - _OPTIONAL_ - for the mothod accepting one, the request body specification (see examples on how to structure it).
   - `responses` (array) - _REQUIRED_ - the different responses that may be returned by the route (see examples on how to structure it).
   - `handler` (function) - _REQUIRED_ - the actual "busniess" function that read params and respond to the client. This function receives the usual `req` and `res` parameters from express.js, plus the configuration of the application (see below how this configuration is defined).

2. Import and instanciate a new `oapi-routing-system` instance:
   ```javascript
   import { OApiRoutingSystem } from 'oapi-routing-system';

    // This is a dummy configuration for our routes
    // It can be anything and will be passed to each route handler untouched
    const configuration = {};

   // Initialize a new router, passing in the configuration reference.
   // This configuraiton object can then be used in any route handler.
   const crs = new OApiRoutingSystem(configuration);

   // Set the generic information about the API required by OpenAPI.
   // You may ommit this call for quick tests, but your OpenAPI json won't be strictly valid.
   await crs.defineOpenApiInfo(title, description, version);

   // Load routes from the file system assuming they are declared in `src/route` (using dynamic imports).
   await crs.loadFile('src/route/hellow-world.mjs');
   // You can also use `loadFile(path)` if you prefer to load them one by one
   // or `loadModule(name, module)` if you want to import the files statically.
   ```

3. Get the router and OpenAPI definition to use in your express server:
   ```javascript
   import express from 'express';
   import swagger from 'swagger-ui-express';

   // Create an express server with JSON and urlencoded body parsers.
   const app = express();
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   // Get the final open-api description and serve it with you favourite UI (here, we use swagger-ui).
   const openapi = crs.getOpenApiAsJson();
   app.use('/swagger', swagger.serve);
   app.get('/swagger', swagger.setup(openapi));

   // Add our router to the express server.
   app.use(crs.getRouter());

   // Start the server.
   app.listen(port, () => console.log(`Server listening on port ${port}`));
   ```

4. While not really mandatory, it is strongly recomended to also setup a custom error handler for validation errors:
   ```javascript
   import { ValidationError } from 'oapi-routing-system';

   // Add error management: OApiRoutingSystem will forward a ValidationError if a request is invalid.
   // Here, we return an HTTP 400 error in this case, with the descriptive message contained in the error.
   app.use((err, req, res, next) => {
       if (err instanceof ValidationError) {
           // Customize the response as you like.
           res.status(400).send(err.message);
       } else {
           next(err);
       }
   });
   ```
