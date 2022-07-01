import fsp from 'node:fs/promises';
import express from 'express';
import _ from 'lodash';
import { basename, resolve } from 'path';

import Route from './model/route.class.mjs';
import { ValidationError } from './utils/errors.mjs';

async function validate(req, route) {
    // Ensure all required uri parameters are present
    for (const { name } of route.uriParams) {
        if (req.params[name] == null) {
            throw new ValidationError(`URI parameter "${name}" is required`);
        }
    }
    // Ensure all given uri parameters are expected and valid
    for (const [key, value] of Object.entries(req.params)) {
        const parameter = route.uriParams.find((p) => p.name === key);
        if (parameter == null) {
            throw new ValidationError(`unexpected parameter "${key}" in URI`);
        }
        parameter.validate(value);
    }

    // Ensure all required query parameters are present
    for (const { name } of route.queryParams.filter((p) => p.required)) {
        if (req.query[name] == null) {
            throw new ValidationError(`query parameter "${name}" is required`);
        }
    }
    // Ensure all given query parameters are expected and valid
    for (const [key, value] of Object.entries(req.query)) {
        const parameter = route.queryParams.find((p) => p.name === key);
        if (parameter == null) {
            delete req.query[key];
        }
        parameter.validate(value);
    }

    // Validate body
    if (route.body) {
        route.body.validate(req.body, 'body');
    }
}

export default class CustomRoutingSystem {
    constructor(configuration) {
        this.cfg = configuration;
        this.openapi = {
            openapi: '3.0.0',
            info: {},
        };

        this.router = express.Router();
        this.router.get('/api.json', (req, res) => res.json(this.openapi));
    }

    getOpenApiAsJson() {
        return this.openapi;
    }

    getRouter() {
        return this.router;
    }

    /*
     * Define OpenAPI base information directly (title, description and version).
     */
    async defineOpenApiInfo(title, description, version) {
        this.openapi = _.merge(this.openapi, {
            info: { title, description, version },
        });
    }

    /*
     * Define OpenAPI base information from the API package.json.
     * Load the API `package.json` and pass the resulting object to this function.
     * The package.json file is expected to define at least the properties `name`,
     * `description` and `version`.
     *
     * Example:
     *   const crs = new OApiRoutingSystem();
     *   const infos = await import("./package.json");
     *   await crs.defineOpenApiFromPackage(infos);
     */
    async defineOpenApiFromPackage(infos) {
        if (typeof infos.name === 'undefined') {
            throw new Error('The package.json does not define the application name.');
        }
        if (typeof infos.description === 'undefined') {
            throw new Error('The package.json does not define any description.');
        }
        if (typeof infos.version === 'undefined') {
            throw new Error('The package.json does not define the application version.');
        }

        this.openapi = _.merge(this.openapi, {
            info: {
                title: infos.name,
                description: infos.description,
                version: infos.version,
            },
        });
    }

    /*
     * Add one route, assuming `name` is the route name and `module`
     * is the module resulting from the file import.
     *
     * Example:
     *   import route from './route/hellow-world.mjs';
     *   const crs = new OApiRoutingSystem();
     *   await crs.loadRoute('hellow-world', route);
     */
    async loadRoute(name, module) {
        const route = new Route(name, module);
        this.openapi.paths = _.merge(this.openapi.paths, route.describe());

        const handler = async (req, res) => {
            await validate(req, route);
            await route.handler(req, res, this.cfg);
        };
        const wrapper = (req, res, next) => handler(req, res).catch(next);

        switch (route.method) {
            case 'get':
                this.router.get(route.endpoint, wrapper);
                break;
            case 'delete':
                this.router.delete(route.endpoint, wrapper);
                break;
            case 'head':
                this.router.head(route.endpoint, wrapper);
                break;
            case 'options':
                this.router.options(route.endpoint, wrapper);
                break;
            case 'patch':
                this.router.patch(route.endpoint, wrapper);
                break;
            case 'post':
                this.router.post(route.endpoint, wrapper);
                break;
            case 'put':
                this.router.put(route.endpoint, wrapper);
                break;
            default:
                throw new Error(`method for route ${route.endpoint} is invalid: "${route.method}"`);
        }
    }

    /*
     * Add one route by reading directly the file on the file system.
     * The route name is derived from the file name.
     *
     * Example:
     *   const crs = new OApiRoutingSystem();
     *   await crs.loadFile('src/route/hellow-world.mjs');
     */
    async loadFile(path) {
        const name = basename(path);
        const fileAbsPath = resolve(path);
        const module = await import(`file:${fileAbsPath}`);
        return this.loadRoute(name, module);
    }

    /*
     * Add several routes from the given folder path, assuming each javascript
     * file (*.mjs and *.js) in this folder is a route.
     * The route name is derived from the file name.
     *
     * Example:
     *   const crs = new OApiRoutingSystem();
     *   await crs.loadFolder('src/route/');
     */
    async loadFolder(path) {
        const files = await fsp.readdir(path);
        await Promise.all(
            files
                .filter(((name) => name.endsWith('.mjs') || name.endsWith('.js')))
                .map(async (name) => this.loadFile(`${path}/${name}`)),
        );
    }
}
