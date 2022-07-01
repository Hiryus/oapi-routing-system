import Schema from './schema.class.mjs';

export default class Parameter {
    constructor(route, name, schema, type) {
        if (typeof name !== 'string') {
            throw new Error(`in route ${route}, parameters names must be strings (${typeof name} given)`);
        }
        if (typeof schema.$description !== 'string') {
            throw new Error(`in route ${route}, parameter ${name} must have a string description (${typeof schema.$description} given)`);
        }
        if (type !== 'path' && type !== 'query') {
            throw new Error(`in route ${route}, the type for parameter "${name}" must be either "path" or "query" ("${type}" given)`);
        }
        if (type === 'path' && schema.$required === false) {
            throw new Error(`in route ${route}, the parameter "${name}" is marked as optional whereas path parameters are always required`);
        }

        this.type = type;
        this.name = name;
        this.description = schema.$description;
        this.schema = new Schema(schema);
        this.required = (typeof schema.$required === 'boolean') ? schema.$required : true;
        this.validator = this.schema.validator;
    }

    describe() {
        return {
            name: this.name,
            description: this.description,
            in: this.type,
            required: this.required,
            schema: this.schema.describe(),
        };
    }

    validate(value) {
        this.schema.validate(value, this.name);
    }
}
