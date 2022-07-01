import characters from '../data/characters.mjs';
import characterSchema from '../schema/character.mjs';
import errorSchema from '../schema/error.mjs';

export const method = 'post';
export const endpoint = '/character';
export const summary = 'Add a new character.';

export const body = {
    name: characterSchema.name,
    class: characterSchema.class,
    hp: characterSchema.hp,
};

export const responses = [{
    $code: 200,
    $description: 'Details of the new character, including the id.',
    $contentType: 'application/json',
    $schema: characterSchema,
}, {
    $code: 400,
    $description: 'The given parameters are invalid (code `INPUT_VALIDATION_ERROR`) or a character with this name already exists (code `NAME_ALREADY_EXISTS`).',
    $contentType: 'application/json',
    $schema: errorSchema,
}];

export async function handler(req, res, cfg) {
    const character = characters.find((c) => c.name === req.name);
    if (character != null) {
        res.status(404).json({
            code: 'NAME_ALREADY_EXISTS',
            message: `There is already a character with name '${req.params.name}' (id ${character})`,
            trackingId: 'b21bca30-9554-4d3e-a912-38e4db188b86',
        });
    } else {
        // Since this demo does not have a real database, no character
        // is actually added, we only diplay fake results
        res.json({
            id: 'c2562a62-9d1a-49af-81ae-0db2f7b96a36',
            name: req.body.name,
            class: req.body.class,
            hp: req.body.hp,
        });
    }
}
