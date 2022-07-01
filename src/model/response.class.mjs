import Schema from './schema.class.mjs';

export default class Response {
    constructor(routeName, data) {
        if (typeof data.$code !== 'number') {
            throw new Error(`in route ${routeName}, a response code is invalid (expecting number, ${typeof data.$code} given)`);
        }
        if (!Number.isInteger(data.$code) || (data.$code < 100) || (600 < data.$code)) {
            throw new Error(`in route ${routeName}, response code ${data.$code} must be an integer between 100 and 599`);
        }
        if (typeof data.$description !== 'string') {
            throw new Error(`in route ${routeName}, the description for response "${data.$code}" must be a string (${typeof data.$description} given)`);
        }
        if (typeof data.$contentType !== 'string') {
            throw new Error(`in route ${routeName}, the type for response "${data.$code}" must be a string (${typeof data.$contentType} given)`);
        }

        this.code = data.$code;
        this.description = data.$description;
        this.contentType = data.$contentType;
        this.schema = new Schema(data.$schema, data.$example);
    }

    describe() {
        return {
            [this.code]: {
                description: this.description,
                content: {
                    [this.contentType]: {
                        schema: this.schema.describe(),
                    },
                },
            },
        };
    }
}
