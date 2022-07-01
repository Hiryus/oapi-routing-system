/*
 * This is the schema of potential errors returned by our API.
 *
 * To simplify the clients life, it is recommended to have a standard error format as
 * demonstrated here. * Although, this is totally optional.
 *
 * Note this schema uses the `integer` type which can be further specified by a more
 * precise `$format`, * as defined by the OpenAPI specification.
 */

export default {
    code: {
        $type: 'integer',
        $format: 'int32',
        $required: true,
        $example: 18404,
    },
    message: {
        $type: 'string',
        $required: true,
        $example: 'The requested key does not exist.',
    },
    trackingId: {
        $type: 'string',
        $required: true,
        $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
    },
};
