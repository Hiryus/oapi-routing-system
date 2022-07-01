import validators from '../validators.mjs';
import key from '../schema/key.mjs';
import error from '../schema/error.mjs';

// REQUIRED - HTTP endpoint (aka. path) where to mount this route.
export const endpoint = '/key/:id';
// OPTIONAL - The HTTP method (defaults to "get").
export const method = 'get';
// RECOMENDED - A quick summary of what this route does. Try to keep it short.
export const summary = 'Get one key by id.';
// OPTIONAL - If you need more place to describe the route behavior.
export const description = 'You can use the description for longer text. It is not limited.';

/*
 * Parameters from the URI.
 * Each key should have the corresponding param in the URI (here `:id`).
 */
export const parameters = {
    id: {
        $type: 'string',
        $description: 'id of the requested key',
        $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        $validator: validators.uuid,
    },
};

/*
 * Description of the different responses returned by this route.
 * To avoid code duplication, the key and error schemas are offloaded in external
 * files which are shared between routes.
 */
export const responses = [{
    $code: 200,
    $description: 'Details of the requested key.',
    $contentType: 'application/json',
    $schema: key,
}, {
    $code: 400,
    $description: 'The given parameters are invalid.',
    $contentType: 'application/json',
    $schema: error,
}, {
    $code: 404,
    $description: 'This key id does not exist.',
    $contentType: 'application/json',
    $schema: error,
}];

/*
 * The actual route handler which contain the business code.
 * It is only called if the parameters are valid, so you don't need to check them here.
 */
export async function handler(req, res, cfg) {
    if (req.params.id === 'b21bca30-9554-4d3e-a912-38e4db188b86') {
        res.status(200).json({
            id: 'b21bca30-9554-4d3e-a912-38e4db188b86',
            owner: '1475',
            recipient: 'batman@gmail.com',
        });
    } else {
        res.status(404).json({
            code: 18404,
            message: 'The requested key does not exist.',
            trackingId: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        });
    }
}
