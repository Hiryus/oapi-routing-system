import characters from '../data/characters.mjs';
import characterSchema from '../schema/character.mjs';
import errorSchema from '../schema/error.mjs';

// The default method being 'get', the declaration is omitted here
export const endpoint = '/character/:id';
export const summary = 'Get character detailed information by character id.';

export const parameters = {
    id: characterSchema.id,
};

export const responses = [{
    $code: 200,
    $description: 'Details of the requested character.',
    $contentType: 'application/json',
    $schema: characterSchema,
}, {
    $code: 400,
    $description: 'The given parameters are invalid (code `INPUT_VALIDATION_ERROR`).',
    $contentType: 'application/json',
    $schema: errorSchema,
}, {
    $code: 404,
    $description: 'The given character id does not exist (code `CHARACTER_NOT_FOUND`).',
    $contentType: 'application/json',
    $schema: errorSchema,
}];

export async function handler(req, res, cfg) {
    const character = characters.find((c) => c.id === req.params.id);
    if (character == null) {
        res.status(404).json({
            code: 'CHARACTER_NOT_FOUND',
            message: `There is no character with id '${req.params.id}'`,
            trackingId: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        });
    } else {
        res.json(character);
    }
}
