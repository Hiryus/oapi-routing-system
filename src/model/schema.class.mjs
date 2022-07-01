/* eslint no-param-reassign: "off", brace-style: "off" */

import _ from 'lodash';
import { ParsingError, ValidationError } from '../utils/errors.mjs';

const DATE_VALIDATOR = /^\d{4}-\d{2}-\d{2}$/i;
const DATETIME_VALIDATOR = /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z|[+-]\d{2}:\d{2}$/i;
const TYPES_MAPPING = {
    integer: ['int32', 'int64'],
    number: ['float', 'double'],
    string: [null, 'date', 'date-time', 'password'],
    boolean: null,
};

function requiredKeys(obj) {
    return Object.entries(obj)
        .filter(([key, value]) => value.required)
        .map(([key, value]) => key);
}

export default class Schema {
    constructor(data, example = null) {
        if (typeof data === 'string') {
            if (!TYPES_MAPPING[data]) {
                throw new ParsingError(`invalid schema type "${data}", allowed values are: ${Object.keys(TYPES_MAPPING)}`);
            }
            this.type = data;
            this.example = example || null;
            this.format = TYPES_MAPPING[data][0];
            this.required = true;
            this.validator = data.$validator || null;
        }
        else if (typeof data === 'object' && typeof data.$type === 'string') {
            if (!TYPES_MAPPING[data.$type]) {
                throw new ParsingError(`invalid schema type "${data.$type}", allowed values are: ${Object.keys(TYPES_MAPPING)}`);
            }
            if (typeof data.$format !== 'undefined' && !TYPES_MAPPING[data.$type].includes(data.$format)) {
                throw new ParsingError(`invalid schema format "${data.$format}", allowed values are: ${TYPES_MAPPING[data.$type]}`);
            }
            this.type = data.$type;
            this.example = data.$example || null;
            this.format = data.$format || TYPES_MAPPING[data.$type][0];
            this.required = (typeof data.$required === 'boolean') ? data.$required : true;
            this.validator = data.$validator || null;
        }
        else if (Array.isArray(data)) {
            if (data.length !== 1) {
                throw new ParsingError('invalid schema: an array should contain one and only one element describing the type of items in the array');
            }
            this.type = 'array';
            this.schema = new Schema(data[0]);
            this.required = this.schema.required;
        }
        else if (typeof data === 'object') {
            this.type = 'object';
            this.schema = {};
            for (const key of Object.keys(data)) {
                this.schema[key] = new Schema(data[key]);
            }
            this.required = Object.values(this.schema).some((s) => s.required);
        }
        else {
            throw new Error(`invalid schema: unexpected type ${typeof data}`);
        }
    }

    describe() {
        switch (this.type) {
            case 'array': return {
                type: this.type,
                items: this.schema.describe(),
            };
            case 'object': return {
                type: this.type,
                properties: _.zipObject(
                    Object.keys(this.schema),
                    Object.values(this.schema).map((s) => s.describe()),
                ),
                required: requiredKeys(this.schema),
            };
            default:
                const spec = { type: this.type };
                if (this.format) spec.format = this.format;
                if (this.example) spec.example = this.example;
                return spec;
        }
    }

    validate(data, path) {
        if (this.type === 'boolean' && typeof data !== 'boolean') {
            throw new ValidationError(`${path} must be a boolean`);
        }
        if (this.type === 'integer' && !Number.isInteger(data)) {
            throw new ValidationError(`${path} must be an integer`);
        }
        if (this.type === 'number' && typeof data !== 'number') {
            throw new ValidationError(`${path} must be a number`);
        }
        if (this.type === 'string') {
            if (typeof data !== 'string') {
                throw new ValidationError(`${path} must be a string`);
            }
            if (this.format === 'date' && !data.match(DATE_VALIDATOR)) {
                throw new ValidationError(`${path} must be a valid date (as defined by RFC3339 "full-date" format)`);
            }
            if (this.format === 'date-time' && !data.match(DATETIME_VALIDATOR)) {
                throw new ValidationError(`${path} must be a valid date-time (as defined by RFC3339 "date-time" format)`);
            }
        }
        if (this.type === 'array') {
            if (!Array.isArray(data)) {
                throw new ValidationError(`${path} must be an array`);
            }
            for (const [idx, item] of data.entries()) {
                this.schema.validate(item, `${path}.${idx}`);
            }
        }
        if (this.type === 'object') {
            if (typeof data !== 'object') {
                throw new ValidationError(`${path} must be an object with properties (${typeof data} given)`);
            }
            for (const key of requiredKeys(this.schema)) {
                if (!(key in data)) {
                    throw new ValidationError(`${path} lacks the property "${key}"`);
                }
            }
            for (const [key, value] of Object.entries(data)) {
                if (key in this.schema) {
                    this.schema[key].validate(value, `${path}.${key}`);
                } else {
                    delete data[key];
                }
            }
        }
        if (typeof this.validator === 'function') {
            const error = this.validator(data);
            if (error instanceof Error) {
                throw new ValidationError(`${path} is invalid: ${error.message}`);
            }
        }
    }
}
