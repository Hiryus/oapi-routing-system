import characters from '../data/characters.mjs';
import characterSchema from '../schema/character.mjs';
import errorSchema from '../schema/error.mjs';

export const method = 'patch';
export const endpoint = '/character/:id';
export const summary = 'Update an existing character.';

export const parameters = {
    id: characterSchema.id,
};
export const body = {
    name: characterSchema.name,
    class: characterSchema.class,
    hp: characterSchema.hp,
};

export const responses = [{
    $code: 200,
    $description: 'Updated details of the character.',
    $contentType: 'application/json',
    $schema: characterSchema,
}, {
    $code: 400,
    $description: 'The given parameters are invalid.',
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
        // Since this demo does not have a real database, the character
        // is not actually changed, we only diplay fake results
        res.json({
            id: character.id,
            name: req.body.name,
            class: req.body.class,
            hp: req.body.hp,
        });
    }
}
