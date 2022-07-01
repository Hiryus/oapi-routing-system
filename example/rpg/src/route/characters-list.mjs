import characters from '../data/characters.mjs';
import characterSchema from '../schema/character.mjs';
import paginate from '../schema/paginate.mjs';

// The default method being 'get', the declaration is omitted here
export const endpoint = '/characters';
export const summary = 'List all characters, returning their id and name.';

export const query = paginate.query;

export const responses = [{
    $code: 200,
    $description: 'Details of the requested key.',
    $contentType: 'application/json',
    $schema: paginate.response({
        id: characterSchema.id,
        name: characterSchema.name,
    }),
}];

export async function handler(req, res, cfg) {
    // Re-map data to keep only the id and name of each character
    const results = characters.map(({ id, name }) => ({ id, name }));
    // Return the list of id/name
    res.json(results);
}
