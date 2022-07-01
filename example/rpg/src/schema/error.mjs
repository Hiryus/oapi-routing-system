export default {
    code: {
        $type: 'integer',
        $format: 'int32',
        $description: 'A code describing the error type.',
        $example: 18404,
        $required: true,
    },
    message: {
        $type: 'string',
        $description: 'A human-readable message describing the error.',
        $example: 'The requested key does not exist.',
        $required: true,
    },
    trackingId: {
        $type: 'string',
        $description: 'An id to identify this request. Give it to the support team to track this error.',
        $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        $required: true,
    },
};
