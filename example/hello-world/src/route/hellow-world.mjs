// REQUIRED - HTTP endpoint (aka. path) where to mount this route.
export const endpoint = '/';
// OPTIONAL - The HTTP method (defaults to "get").
export const method = 'get';
// RECOMENDED - A quick summary of what this route does. Try to keep it short.
export const summary = 'Salute the visitor by his / her name.';

/*
 * Query parameters (there is actually only one here: `name`).
 */
export const query = {
    name: {
        $type: 'string',
        $description: 'The visitor\'s name',
        $example: 'Bob',
    },
};

/*
 * Description of the different responses returned by this route.
 */
export const responses = [{
    $code: 200,
    $contentType: 'text/plain',
    $description: 'A salutation message.',
    $example: 'Hello Bob!',
    $schema: 'string',
}];

/*
 * The actual route handler which contain the business code.
 * It is only called if the parameters are valid, so you don't need to check them here.
 */
export async function handler(req, res, cfg) {
    res.send(`Hellow ${req.query.name}!`);
}
