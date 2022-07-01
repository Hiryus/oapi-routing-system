import error from '../schema/error.mjs';
import key from '../schema/key.mjs';
import validators from '../validators.mjs';

// REQUIRED - HTTP endpoint (aka. path) where to mount this route.
export const endpoint = '/key';
// OPTIONAL - The HTTP method (defaults to "get").
export const method = 'post';
// RECOMENDED - A quick summary of what this route does. Try to keep it short.
export const summary = 'Add a new key.';
// OPTIONAL - If you need more place to describe the route behavior.
export const description = 'There is not much more to say, but you can use the description for longer text.';

/*
 * The request body for method supported it (ex: POST PATCH, PUT, etc.).
 * This is where schemas may usually span accros multiple levels if you enable
 * the JSON parsing middleware.
 *
 * This one defines three parameters: `owner.id`, `owner.email` and `recipients`,
 * the latter being an array.
 *
 * For example, this would be a valid body:
 * {
 *   "owner": {
 *     "id": "b21bca30-9554-4d3e-a912-38e4db188b86",
 *     "email": "batman@gmail.com"
 *   },
 *   recipients: ["robin@gmail.com", "superman@gmail.com"]
 * }
 */
export const body = {
    owner: {
        id: {
            $description: 'The key owner\'s id.',
            $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
            $required: true,
            $type: 'string',
            $validator: validators.uuid,
        },
        email: {
            $description: 'The key owner\'s id.',
            $example: 'batman@gmail.com',
            $required: true,
            $type: 'string',
            $validator: validators.email,
        },
    },
    recipients: [{
        $description: 'The list of recipients to whom the key was sent.',
        $example: 'batman@gmail.com',
        $required: false,
        $type: 'string',
        $validator: validators.email,
    }],
};

/*
 * Description of the different responses returned by this route.
 * To avoid code duplication, the key and error schemas are offloaded in external
 * files which are shared between routes.
 */
export const responses = [{
    $code: 200,
    $description: 'Details of the new key, including id.',
    $contentType: 'application/json',
    $schema: key,
}, {
    $code: 400,
    $description: 'The given parameters are invalid.',
    $contentType: 'application/json',
    $schema: error,
}];

/*
 * The actual route handler which contain the business code.
 * It is only called if the parameters are valid, so you don't need to check them here.
 */
export async function handler(req, res, cfg) {
    res.status(200).json({
        id: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        owner: req.body.owner.id,
        recipient: req.body.recipient || null,
    });
}
