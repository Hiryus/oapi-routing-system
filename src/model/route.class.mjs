import _ from 'lodash';
import Parameter from './parameter.class.mjs';
import Response from './response.class.mjs';
import Schema from './schema.class.mjs';

export default class Route {
    constructor(name, data) {
        if (typeof data.endpoint !== 'string') {
            throw new Error(`route ${name} does not have a valid endpoint (string expected, ${typeof data.description} given)`);
        }
        if (typeof data.method !== 'undefined' && typeof data.method !== 'string') {
            throw new Error(`route ${name}, does not have a valid method (string expected, ${typeof data.description} given)`);
        }
        if (typeof data.summary !== 'undefined' && typeof data.summary !== 'string') {
            throw new Error(`route ${name}, does not have a valid summary (string expected, ${typeof data.description} given)`);
        }
        if (typeof data.description !== 'undefined' && typeof data.description !== 'string') {
            throw new Error(`route ${name}, does not have a valid description (string expected, ${typeof data.description} given)`);
        }
        if (typeof data.responses !== 'undefined' && !Array.isArray(data.responses)) {
            throw new Error(`route ${name}, does not have valid responses (array expected, ${typeof data.description} given)`);
        }
        if (typeof data.body !== 'undefined' && typeof data.body !== 'object') {
            throw new Error(`route ${name}, does not have a valid body (schema expected, ${typeof data.description} given)`);
        }
        if (typeof data.query !== 'undefined' && typeof data.query !== 'object') {
            throw new Error(`route ${name}, does not have a valid query (object expected, ${typeof data.description} given)`);
        }
        if (typeof data.parameters !== 'undefined' && typeof data.parameters !== 'object') {
            throw new Error(`route ${name}, does not have a valid body (object expected, ${typeof data.description} given)`);
        }
        if (typeof data.handler !== 'function') {
            throw new Error(`route ${name} does not have a valid handler function`);
        }

        this.endpoint = data.endpoint;
        this.method = data.method || 'get';
        this.handler = data.handler;
        this.summary = data.summary;
        this.description = data.description;
        this.responses = (data.responses || []).map((response) => new Response(name, response));
        this.body = data.body ? new Schema(data.body) : null;
        this.queryParams = data.query
            ? Object.entries(data.query).map(([key, value]) => new Parameter(name, key, value, 'query'))
            : [];
        this.uriParams = data.parameters
            ? Object.entries(data.parameters).map(([key, value]) => new Parameter(name, key, value, 'path'))
            : [];
    }

    describe() {
        const endpoint = this.endpoint.replace(/:([^/]+)/i, '{$1}'); // replaces :param by {param}
        const responses = this.responses.map((r) => r.describe());
        const parameters = [
            ...this.queryParams.map((p) => p.describe()),
            ...this.uriParams.map((p) => p.describe()),
        ];

        if (this.body) {
            return {
                [endpoint]: {
                    [this.method]: {
                        summary: this.summary,
                        description: this.description,
                        responses: _.merge({}, ...responses),
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: this.body.describe(),
                                },
                            },
                        },
                        parameters,
                    },
                },
            };
        } else {
            return {
                [endpoint]: {
                    [this.method]: {
                        summary: this.summary,
                        description: this.description,
                        responses: _.merge({}, ...responses),
                        parameters,
                    },
                },
            };
        }
    }
}
