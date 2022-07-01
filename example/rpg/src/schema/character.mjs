import validators from '../validators.mjs';

export default {
    id: {
        $type: 'string',
        $description: 'The technical identifier of the character (guaranteed to never change).',
        $example: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        $validator: validators.uuid,
    },
    name: {
        $type: 'string',
        $description: 'The name of the character .',
        $example: 'Batman',
        $validator: validators.maxLength(25),
    },
    class: {
        $type: 'string',
        $description: 'The class of the character (this is the real name, not an identifier).',
        $example: 'monk',
        $validator: validators.dndClass,
    },
    hp: {
        $type: 'integer',
        $description: 'The current hit points of the character.',
        $format: 'int32',
        $example: 101,
        $validator: validators.positive,
    },
};
