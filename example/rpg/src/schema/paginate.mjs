import validators from '../validators.mjs';

export const query = {
    count: {
        $type: 'integer',
        $default: 10,
        $description: 'Number of items per page.',
        $required: false,
        $validator: validators.positive,
    },
    page: {
        $type: 'integer',
        $default: 0,
        $required: false,
        $description: 'The page number to request starting at 0.',
        $validator: validators.positive,
    },
};

export function response(schema) {
    return {
        items: [schema],
        page: {
            $type: 'integer',
            $description: 'The current page number (as requested).',
            $example: 1,
        },
        total: {
            $type: 'integer',
            $description: 'The total number of items in database.',
            $example: 98,
        },
    };
}

export default { query, response };
