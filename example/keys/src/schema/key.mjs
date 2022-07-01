/*
 * This is the schema of ours keys which is used in the different routes.
 * Each one has an id, an owner and a recipient.
 *
 * This schema is quite simple, with only one level of parameters (`id`, `owner` and `recipient`).
 * Each parameter defines its type (here, they are all strings) and two optional properties:
 * if the parameter is required and an example value.
 *
 * For more complex schemas, it is also possible to add a `$description` and/or a validator
 * (cf. the PRG example).
 *
 * Note that each property starts with a dollar sign while properties usually do not.
 * While it is possible to define parameters starting by a dollar sign (as long as they are not
 * used by the library), it is strongly discouraged as further versions may add more properties.
 */

export default {
    id: {
        $type: 'string',
        $required: true,
        $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
    },
    owner: {
        $type: 'string',
        $required: true,
        $example: '1475',
    },
    recipient: {
        $type: 'string',
        $required: false,
        $example: 'batman@gmail.com',
    },
};
